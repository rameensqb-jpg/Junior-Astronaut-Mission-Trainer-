import {
  MODEL,
  RESOURCES,
  START,
  START_SYSTEMS,
  START_RADIATION,
  MISSION_DAYS,
  CREW_SIZE,
  clamp,
  rand,
} from "./config";
import { pickScenario, getScenario } from "./scenarios";

export const clone = (value) => JSON.parse(JSON.stringify(value));

const SYSTEM_KEYS = ["panels", "lifeSupport", "recycler", "greenhouse", "comms", "rover"];
const RES_KEYS = ["energy", "oxygen", "water", "food"];

export function applyEffects(state, effects = {}) {
  RES_KEYS.forEach((k) => {
    if (typeof effects[k] === "number") {
      state.resources[k] = clamp(state.resources[k] + effects[k], 0, RESOURCES[k].max);
    }
  });
  SYSTEM_KEYS.forEach((k) => {
    if (typeof effects[k] === "number") state.systems[k] = clamp(state.systems[k] + effects[k], 0, 100);
  });
  if (typeof effects.research === "number") state.research = clamp(state.research + effects.research, 0, 100);
  if (typeof effects.shield === "number") state.radiation.shield = clamp(state.radiation.shield + effects.shield, 0, 95);
  if (typeof effects.exposure === "number") {
    state.radiation.exposure = Math.max(0, Math.round((state.radiation.exposure + effects.exposure) * 100) / 100);
  }
  if (Array.isArray(effects.flags)) effects.flags.forEach((f) => { state.flags[f] = true; });
}

export function snapshot(state) {
  return {
    energy: Math.round(state.resources.energy),
    oxygen: Math.round(state.resources.oxygen * 10) / 10,
    water: Math.round(state.resources.water),
    food: Math.round(state.resources.food * 10) / 10,
    exposure: Math.round(state.radiation.exposure * 100) / 100,
    shield: Math.round(state.radiation.shield),
    research: Math.round(state.research),
    panels: Math.round(state.systems.panels),
    recycler: Math.round(state.systems.recycler),
    lifeSupport: Math.round(state.systems.lifeSupport),
    comms: Math.round(state.systems.comms),
  };
}

function nextId(state) {
  state.seq = (state.seq || 0) + 1;
  return `msg-${state.seq}`;
}

export function addMessage(state, message) {
  state.messages.push({ id: nextId(state), day: state.day, from: "control", priority: "info", ...message });
}

export function createMission({ seed = 2026, commander = null, emblem = "crescent", nasaEvent = null } = {}) {
  const state = {
    id: `luna-${seed}-${Date.now().toString(36)}`,
    seed,
    day: 1,
    totalDays: MISSION_DAYS,
    phase: "active",
    commander,
    emblem,
    nasaEvent,
    resources: { ...START },
    radiation: { ...START_RADIATION },
    systems: { ...START_SYSTEMS },
    research: 0,
    flags: {},
    usedScenarios: [],
    decisions: [],
    log: [{ day: 1, type: "start" }],
    messages: [],
    pending: [],
    seq: 0,
    activeScenario: null,
    lastChoice: null,
    lastReport: null,
    outcome: null,
  };
  addMessage(state, { key: "mc.welcome", priority: "info", options: ["ack"] });
  state.activeScenario = pickScenario(state);
  return state;
}

export function solarFactor(state) {
  const base = 0.74 + rand(state.seed, state.day, 3) * 0.36;
  const dust = state.flags.dust ? 0.86 : 1;
  return base * dust;
}

export function weatherIndex(state) {
  const base = 22 + rand(state.seed, state.day, 5) * 26;
  const storm = state.flags.stormBoost ? 22 : 0;
  return Math.round(clamp(base + storm, 12, 92));
}

export function dailyFlows(state) {
  const panelHealth = clamp(state.systems.panels, 10, 100) / 100;
  const solar = MODEL.solarRated * panelHealth * solarFactor(state);
  const greenhouseOn = !state.flags.greenhouseOff;
  const o2Need = MODEL.o2PerCrewDay * CREW_SIZE;
  const demand =
    MODEL.baseLoad +
    MODEL.recycleKwh +
    MODEL.commsKwh +
    MODEL.o2KwhPerKg * o2Need +
    (greenhouseOn ? MODEL.greenhouseKwh : 0) +
    (state.flags.researchPush ? MODEL.researchKwh : 0) +
    (state.radiation.shield > 50 ? MODEL.shieldKwh : 0);
  return { solar, demand, panelHealth, greenhouseOn, o2Need };
}

export function forecast(state) {
  const { solar, demand, greenhouseOn, o2Need } = dailyFlows(state);
  const available = state.resources.energy;
  const ratio = demand > 0 ? clamp((available + solar) / demand, 0, 1) : 1;
  const o2Prod = o2Need * Math.min(1, ratio) * (0.62 + 0.38 * (state.systems.lifeSupport / 100));
  const crewWater = MODEL.waterPerCrewDay * CREW_SIZE;
  const recyclerEff = clamp(state.systems.recycler / 100, 0, 1) * Math.min(1, ratio) * MODEL.waterRecovery;
  const recovered = crewWater * recyclerEff;
  const o2Water = o2Prod * MODEL.waterPerKgO2;
  const ghWater = greenhouseOn ? MODEL.greenhouseWater : 0;
  const foodUse = MODEL.foodPerCrewDay * CREW_SIZE;
  const foodProd = greenhouseOn && ratio > 0.7 ? MODEL.greenhouseYield * (state.systems.greenhouse / 100) : 0;
  const envIndex = weatherIndex(state);
  const dose = (MODEL.baseDose + (envIndex / 100) * MODEL.doseEnvFactor) * (1 - clamp(state.radiation.shield, 0, 95) / 100);

  return {
    solar: Math.round(solar),
    demand: Math.round(demand),
    netEnergy: Math.round(solar - demand),
    o2Prod: Math.round(o2Prod * 100) / 100,
    o2Use: Math.round(o2Need * 100) / 100,
    waterIn: Math.round(recovered),
    waterOut: Math.round((crewWater + o2Water + ghWater) * 10) / 10,
    foodIn: Math.round(foodProd * 10) / 10,
    foodOut: Math.round(foodUse * 10) / 10,
    dose: Math.round(dose * 100) / 100,
    envIndex,
    ratio,
  };
}

export function resolveChoice(state, choiceId) {
  const s = clone(state);
  const scenario = getScenario(s.activeScenario);
  if (!scenario) return s;
  const choice = scenario.choices.find((c) => c.id === choiceId);
  if (!choice) return s;

  const stateBefore = clone(s);
  const before = snapshot(s);
  applyEffects(s, choice.effects);
  (choice.delays || []).forEach((d) => {
    s.pending.push({
      dueDay: s.day + d.inDays,
      effects: d.effects || {},
      flag: d.flag,
      noteKey: d.noteKey,
      scenarioId: scenario.id,
      choiceId: choice.id,
    });
  });
  const after = snapshot(s);

  s.decisions.push({
    day: s.day,
    scenarioId: scenario.id,
    choiceId: choice.id,
    before,
    after,
    impact: choice.effects,
    stateBefore,
  });
  s.log.push({ day: s.day, type: "choice", scenarioId: scenario.id, choiceId: choice.id, before, after, impact: choice.effects });
  s.usedScenarios.push(scenario.id);
  s.lastChoice = { scenarioId: scenario.id, choiceId: choice.id, day: s.day };
  s.activeScenario = null;
  return s;
}

export function advanceDay(state) {
  const s = clone(state);
  const report = {
    day: s.day,
    delayed: [],
    warnings: [],
    flows: null,
    before: snapshot(s),
    after: null,
  };

  // 1. Delayed consequences that come due now
  const due = s.pending.filter((p) => p.dueDay <= s.day);
  s.pending = s.pending.filter((p) => p.dueDay > s.day);
  due.forEach((p) => {
    if (p.flag) s.flags[p.flag] = true;
    applyEffects(s, p.effects);
    report.delayed.push({ noteKey: p.noteKey, effects: p.effects, scenarioId: p.scenarioId, choiceId: p.choiceId });
    s.log.push({ day: s.day, type: "delayed", noteKey: p.noteKey, effects: p.effects, scenarioId: p.scenarioId, choiceId: p.choiceId });
    addMessage(s, { key: "mc.delayed", priority: "warning", params: { note: p.noteKey }, detail: p.effects });
  });

  // 2. Energy
  const { solar, demand, greenhouseOn, o2Need } = dailyFlows(s);
  const available = s.resources.energy;
  const ratio = demand > 0 ? clamp((available + solar) / demand, 0, 1) : 1;
  s.resources.energy = clamp(available + solar - demand, 0, RESOURCES.energy.max);

  // 3. Oxygen (life support needs power + water)
  const lifeSupportHealth = s.systems.lifeSupport / 100;
  const o2Prod = o2Need * Math.min(1, ratio) * (0.62 + 0.38 * lifeSupportHealth);
  s.resources.oxygen = clamp(s.resources.oxygen + o2Prod - o2Need, 0, RESOURCES.oxygen.max);

  // 4. Water
  const crewWater = MODEL.waterPerCrewDay * CREW_SIZE;
  const recyclerEff = clamp(s.systems.recycler / 100, 0, 1) * Math.min(1, ratio) * MODEL.waterRecovery;
  const recovered = crewWater * recyclerEff;
  const o2Water = o2Prod * MODEL.waterPerKgO2;
  const ghWater = greenhouseOn ? MODEL.greenhouseWater : 0;
  s.resources.water = clamp(s.resources.water + recovered - crewWater - o2Water - ghWater, 0, RESOURCES.water.max);

  // 5. Food
  const foodUse = MODEL.foodPerCrewDay * CREW_SIZE;
  const foodProd = greenhouseOn && ratio > 0.7 ? MODEL.greenhouseYield * (s.systems.greenhouse / 100) : 0;
  s.resources.food = clamp(s.resources.food + foodProd - foodUse, 0, RESOURCES.food.max);

  // 6. Radiation
  s.radiation.envIndex = weatherIndex(s);
  if (s.flags.stormBoost) s.flags.stormBoost = false;
  const dose = (MODEL.baseDose + (s.radiation.envIndex / 100) * MODEL.doseEnvFactor) * (1 - clamp(s.radiation.shield, 0, 95) / 100);
  s.radiation.exposure = Math.round((s.radiation.exposure + dose) * 100) / 100;

  // 7. Wear and tear
  const stress = ratio < 0.9 ? 1.8 : 1;
  s.systems.panels = clamp(s.systems.panels - 1.1 * stress, 0, 100);
  s.systems.recycler = clamp(s.systems.recycler - 0.9 * stress, 0, 100);
  s.systems.lifeSupport = clamp(s.systems.lifeSupport - 0.7 * stress, 0, 100);
  s.systems.greenhouse = clamp(s.systems.greenhouse - 0.5, 0, 100);
  s.systems.comms = clamp(s.systems.comms - 0.35, 0, 100);
  s.systems.rover = clamp(s.systems.rover - 0.6, 0, 100);

  report.flows = {
    solar: Math.round(solar),
    demand: Math.round(demand),
    o2Prod: Math.round(o2Prod * 100) / 100,
    o2Use: Math.round(o2Need * 100) / 100,
    waterIn: Math.round(recovered),
    waterOut: Math.round((crewWater + o2Water + ghWater) * 10) / 10,
    foodIn: Math.round(foodProd * 10) / 10,
    foodOut: Math.round(foodUse * 10) / 10,
    dose: Math.round(dose * 100) / 100,
    ratio: Math.round(ratio * 100) / 100,
  };

  // 8. Warnings (always before failure)
  RES_KEYS.forEach((k) => {
    const value = s.resources[k];
    const meta = RESOURCES[k];
    if (value <= meta.max * meta.critPct) {
      report.warnings.push({ resource: k, level: "critical" });
    } else if (value <= meta.max * meta.warnPct) {
      report.warnings.push({ resource: k, level: "warning" });
    }
  });
  if (ratio < 0.85) report.warnings.push({ resource: "power", level: "warning" });
  if (s.radiation.exposure > 12) report.warnings.push({ resource: "radiation", level: "critical" });
  if (s.systems.recycler < 35) report.warnings.push({ resource: "water", level: "warning" });
  if (s.systems.comms < 35) report.warnings.push({ resource: "comms", level: "warning" });

  report.warnings.forEach((w) => {
    s.log.push({ day: s.day, type: "warning", resource: w.resource, level: w.level });
  });

  // 9. Mission Control messages generated from the real state
  if (report.warnings.some((w) => w.level === "critical")) {
    const worst = report.warnings.find((w) => w.level === "critical");
    addMessage(s, {
      key: "mc.critical",
      priority: "critical",
      params: { resource: worst.resource },
      options: ["analyse", "ack"],
    });
  } else if (report.warnings.length) {
    addMessage(s, {
      key: "mc.warning",
      priority: "warning",
      params: { resource: report.warnings[0].resource },
      options: ["analyse", "ack"],
    });
  } else {
    addMessage(s, { key: "mc.progress", priority: "info", params: { day: s.day } });
  }

  // 10. Failure evaluation
  const zero = RES_KEYS.find((k) => s.resources[k] <= 0.01);
  if (zero) {
    s.phase = "failed";
    s.outcome = { type: "failure", resource: zero, day: s.day };
  } else if (s.radiation.exposure >= 20) {
    s.phase = "failed";
    s.outcome = { type: "failure", resource: "radiation", day: s.day };
  } else if (s.day >= s.totalDays) {
    s.phase = "success";
    s.outcome = { type: "success", day: s.day };
  } else {
    s.day += 1;
    s.activeScenario = pickScenario(s);
    if (s.activeScenario === "solar_storm" || s.activeScenario === "flare_watch") {
      s.flags.stormBoost = true;
      s.radiation.envIndex = weatherIndex({ ...s, flags: { ...s.flags, stormBoost: true } });
    }
  }

  report.after = snapshot(s);
  s.lastReport = report;
  s.log.push({ day: report.day, type: "report", before: report.before, after: report.after, flows: report.flows, warnings: report.warnings });
  return s;
}

export function respondToMessage(state, messageId, optionId) {
  const s = clone(state);
  const message = s.messages.find((m) => m.id === messageId);
  if (!message || message.answered) return s;
  message.answered = optionId;

  if (optionId === "analyse") {
    const weakest = RES_KEYS.map((k) => ({ k, ratio: s.resources[k] / RESOURCES[k].max })).sort((a, b) => a.ratio - b.ratio)[0];
    addMessage(s, {
      key: "mc.reply.analysis",
      params: { resource: weakest.k, pct: Math.round(weakest.ratio * 100) },
      from: "control",
    });
    s.research = clamp(s.research + 1, 0, 100);
  } else if (optionId === "ack") {
    addMessage(s, { key: "mc.reply.ack", params: { day: s.day } });
  }
  return s;
}

export function requestInfo(state, kind) {
  const s = clone(state);
  const flows = dailyFlows(s);
  const details = {
    resources: [
      { k: "res.energy", v: `${Math.round(s.resources.energy)} kWh` },
      { k: "res.oxygen", v: `${Math.round(s.resources.oxygen * 10) / 10} kg` },
      { k: "res.water", v: `${Math.round(s.resources.water)} L` },
      { k: "res.food", v: `${Math.round(s.resources.food * 10) / 10} kg` },
    ],
    equipment: SYSTEM_KEYS.map((k) => ({ k: `sys.${k}`, v: `${Math.round(s.systems[k])}%` })),
    environment: [
      { k: "env.index", v: `${s.radiation.envIndex}/100` },
      { k: "env.exposure", v: `${s.radiation.exposure.toFixed(2)} mSv-eq` },
      { k: "env.shield", v: `${Math.round(s.radiation.shield)}%` },
    ],
    science: [
      { k: "res.research", v: `${Math.round(s.research)}/100` },
      { k: "env.index", v: `${s.radiation.envIndex}/100` },
    ],
    status: [
      { k: "common.day", v: `${s.day} / ${s.totalDays}` },
      { k: "res.energy", v: `${Math.round(s.resources.energy)} kWh` },
      { k: "sys.lifeSupport", v: `${Math.round(s.systems.lifeSupport)}%` },
    ],
  };

  s.messages.push({ id: nextId(s), day: s.day, from: "player", key: `mc.request.${kind}`, priority: "info" });
  s.messages.push({
    id: nextId(s),
    day: s.day,
    from: "control",
    key: `mc.reply.${kind}`,
    params: { solar: Math.round(flows.solar), demand: Math.round(flows.demand), day: s.day },
    details: details[kind] || [],
    delay: 1.3,
    priority: "info",
  });
  return s;
}

export const RESOURCE_KEYS = RES_KEYS;
export const SYSTEMS = SYSTEM_KEYS;
