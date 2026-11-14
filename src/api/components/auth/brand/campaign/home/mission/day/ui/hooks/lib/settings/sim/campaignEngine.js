import { RESOURCES, START, START_SYSTEMS, START_RADIATION, clamp } from "./config";
import { clone, applyEffects, snapshot, advanceDay, addMessage, respondToMessage, requestInfo } from "./engine";
import { MISSIONS, DAYS_PER_MISSION, TOTAL_MISSIONS, CAMPAIGN_DAYS, getMission } from "./campaign";

export { MISSIONS, DAYS_PER_MISSION, TOTAL_MISSIONS, CAMPAIGN_DAYS, getMission };

const RES_KEYS = ["energy", "oxygen", "water", "food"];
const SYSTEM_KEYS = ["panels", "lifeSupport", "recycler", "greenhouse", "comms", "rover"];

/** Daily resource postures. Effects apply immediately, so the trade-off is visible. */
export const POSTURES = [
  { id: "conserve", effects: { energy: 13, research: -2 } },
  { id: "balanced", effects: { research: 1 } },
  { id: "push", effects: { energy: -14, research: 4 } },
];

export const CREW_ROLES = ["commander", "life", "science", "systems"];

function freshDay(day) {
  return {
    day,
    assignments: {},
    posture: null,
    activitiesRun: false,
    results: [],
    observed: false,
    eventChoice: null,
  };
}

export function createCampaignMission(index, { seed = 7, commander = null, emblem = "crescent", nasaEvent = null } = {}) {
  const def = getMission(index);
  const state = {
    id: `m${def.index}-${seed}-${Date.now().toString(36)}`,
    campaign: true,
    missionIndex: def.index,
    missionId: def.id,
    seed,
    day: 1,
    totalDays: DAYS_PER_MISSION,
    phase: "active",
    commander,
    emblem,
    nasaEvent,
    resources: { ...START },
    radiation: { ...START_RADIATION },
    systems: { ...START_SYSTEMS },
    research: def.startResearch || 0,
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
    dayState: freshDay(1),
    dayHistory: [],
  };

  Object.entries(def.start || {}).forEach(([key, value]) => {
    if (RESOURCES[key]) state.resources[key] = clamp(state.resources[key] + value, 0, RESOURCES[key].max);
    else if (SYSTEM_KEYS.includes(key)) state.systems[key] = clamp(state.systems[key] + value, 0, 100);
  });

  addMessage(state, { key: "mc.welcome", options: ["ack"] });
  addMessage(state, { text: def.days[0].control, priority: "info" });
  return state;
}

export function missionDefinition(state) {
  return getMission(state?.missionIndex || 1);
}

export function currentDay(state) {
  const def = missionDefinition(state);
  return def.days[Math.min(Math.max(1, state.day), DAYS_PER_MISSION) - 1];
}

export function daySteps(state) {
  const day = currentDay(state);
  const ds = state.dayState || freshDay(state.day);
  const assigned = day.tasks.filter((t) => ds.assignments?.[t.id]).length;
  return {
    observed: Boolean(ds.observed),
    assigned,
    totalTasks: day.tasks.length,
    crewDone: assigned === day.tasks.length,
    postureDone: Boolean(ds.posture),
    activitiesDone: Boolean(ds.activitiesRun),
    eventDone: Boolean(ds.eventChoice),
  };
}

export function dayObjectives(state) {
  const day = currentDay(state);
  const s = daySteps(state);
  return [
    { id: "observe", key: "obj.observe", done: s.observed },
    { id: "crew", key: "obj.crew", params: { count: day.tasks.length }, done: s.crewDone },
    { id: "posture", key: "obj.posture", done: s.postureDone },
    { id: "activities", key: "obj.activities", done: s.activitiesDone },
    { id: "event", key: "obj.event", params: { title: day.event.title }, done: s.eventDone },
  ];
}

export const canCloseDay = (state) => dayObjectives(state).every((o) => o.done);

export function observeDay(state) {
  const s = clone(state);
  if (s.dayState.observed) return s;
  const day = currentDay(s);
  s.dayState.observed = true;
  s.research = clamp(s.research + 1, 0, 100);
  s.log.push({ day: s.day, type: "observation", text: day.observation });
  return s;
}

export function assignCrew(state, taskId, crewId) {
  const s = clone(state);
  const next = { ...s.dayState.assignments };
  Object.keys(next).forEach((key) => {
    if (next[key] === crewId) delete next[key];
  });
  if (s.dayState.assignments[taskId] !== crewId) next[taskId] = crewId;
  s.dayState.assignments = next;
  return s;
}

export function choosePosture(state, id) {
  const s = clone(state);
  if (s.dayState.posture) return s;
  const posture = POSTURES.find((p) => p.id === id);
  if (!posture) return s;
  s.dayState.posture = id;
  applyEffects(s, posture.effects);
  s.log.push({ day: s.day, type: "posture", id, effects: posture.effects });
  return s;
}

export function runDayActivities(state) {
  const s = clone(state);
  if (s.dayState.activitiesRun) return s;
  const day = currentDay(s);
  const results = [];

  day.tasks.forEach((task) => {
    const crewId = s.dayState.assignments[task.id];
    if (!crewId) return;
    const match = crewId === task.role;
    const scale = match ? 1 : 0.5;
    const effects = {};
    Object.entries(task.effects || {}).forEach(([key, value]) => {
      effects[key] = Math.round(value * scale * 10) / 10;
    });
    if (!match) effects.research = (effects.research || 0) - 2;
    applyEffects(s, effects);
    results.push({ taskId: task.id, label: task.label, crewId, match, effects });
    s.log.push({ day: s.day, type: "activity", taskId: task.id, crewId, match, effects });
  });

  s.dayState.activitiesRun = true;
  s.dayState.results = results;
  return s;
}

export function resolveDayEvent(state, choiceId) {
  const s = clone(state);
  if (s.dayState.eventChoice) return s;
  const day = currentDay(s);
  const choice = day.event.choices.find((c) => c.id === choiceId);
  if (!choice) return s;

  const stateBefore = clone(s);
  const before = snapshot(s);
  applyEffects(s, choice.effects || {});
  (choice.delays || []).forEach((d) => {
    s.pending.push({
      dueDay: s.day + d.inDays,
      effects: d.effects || {},
      noteKey: d.noteKey,
      scenarioId: day.event.id,
      choiceId: choice.id,
    });
  });
  const after = snapshot(s);

  s.dayState.eventChoice = choice.id;
  s.decisions.push({
    day: s.day,
    scenarioId: day.event.id,
    choiceId: choice.id,
    title: day.event.title,
    label: choice.label,
    before,
    after,
    impact: choice.effects || {},
    stateBefore,
  });
  s.log.push({
    day: s.day,
    type: "choice",
    scenarioId: day.event.id,
    choiceId: choice.id,
    title: day.event.title,
    label: choice.label,
    before,
    after,
    impact: choice.effects || {},
  });
  s.usedScenarios.push(day.event.id);
  s.lastChoice = { scenarioId: day.event.id, choiceId: choice.id, day: s.day };
  return s;
}

export function evaluateMission(state) {
  const def = missionDefinition(state);
  const history = state.dayHistory || [];
  const activityDays = history.filter((h) => (h.activities || []).length > 0).length;
  const eventDays = history.filter((h) => h.event?.label).length;
  const essentialMet = activityDays + eventDays;
  const essentialTotal = DAYS_PER_MISSION * 2;
  const objectivesMet = history.reduce((n, h) => n + (h.objectivesDone || 0), 0);
  const objectivesTotal = history.reduce((n, h) => n + (h.objectivesTotal || 0), 0);
  const researchOk = state.research >= def.requiredResearch;
  const supplyOk =
    RES_KEYS.every((k) => state.resources[k] > RESOURCES[k].max * 0.08) &&
    state.radiation.exposure < 20;
  const daysComplete = history.length >= DAYS_PER_MISSION;
  const passed = daysComplete && essentialMet >= essentialTotal && researchOk && supplyOk;
  const reason = !daysComplete || essentialMet < essentialTotal ? "objectives" : !researchOk ? "research" : !supplyOk ? "supply" : null;

  const objectiveRate = objectivesTotal ? objectivesMet / objectivesTotal : 0;
  const researchRate = Math.min(1, state.research / Math.max(1, def.requiredResearch * 1.5));
  const marginRate =
    RES_KEYS.reduce((sum, k) => sum + Math.min(1, state.resources[k] / RESOURCES[k].max), 0) / RES_KEYS.length;
  const doseRate = Math.max(0, 1 - state.radiation.exposure / 20);
  const score = Math.round(clamp(0.4 * objectiveRate + 0.25 * researchRate + 0.2 * marginRate + 0.15 * doseRate, 0, 1) * 100);

  return {
    passed,
    reason,
    score,
    objectivesMet,
    objectivesTotal,
    essentialMet,
    essentialTotal,
    research: Math.round(state.research),
    requiredResearch: def.requiredResearch,
  };
}

export function closeDay(state) {
  const s = clone(state);
  const day = currentDay(s);
  const objectives = dayObjectives(s);
  const objectiveLines = objectives.map((o) => ({ key: o.key, params: o.params, done: o.done }));
  const activities = s.dayState.results || [];
  const choice = day.event.choices.find((c) => c.id === s.dayState.eventChoice);
  const before = snapshot(s);
  const researchBefore = s.research;

  let next = advanceDay(s);
  next.activeScenario = null;
  next.flags.stormBoost = false;

  next.lastReport = {
    ...(next.lastReport || {}),
    day: day.day,
    objectives: objectiveLines,
    activities,
    posture: s.dayState.posture,
    event: { title: day.event.title, label: choice?.label || "" },
    researchGain: Math.round((next.research - researchBefore) * 10) / 10,
    before,
  };

  next.dayHistory = [
    ...(next.dayHistory || []),
    {
      day: day.day,
      focus: day.focus,
      goal: day.goal,
      objectivesDone: objectiveLines.filter((o) => o.done).length,
      objectivesTotal: objectiveLines.length,
      event: { title: day.event.title, label: choice?.label || "" },
      activities: activities.map((a) => ({ label: a.label, match: a.match })),
      before,
      after: next.lastReport.after,
    },
  ];

  if (next.phase === "active") {
    next.dayState = freshDay(next.day);
    addMessage(next, { key: "mc.progress", params: { day: next.day } });
    addMessage(next, { text: currentDay(next).control, priority: "info" });
    return next;
  }

  const hardFail = next.outcome?.type === "failure";
  const verdict = evaluateMission(next);
  const type = hardFail || !verdict.passed ? "failure" : "success";
  next.phase = type === "success" ? "success" : "failed";
  next.outcome = {
    ...(next.outcome || {}),
    ...verdict,
    type,
    day: next.day,
    reason: hardFail ? next.outcome?.reason || (next.outcome?.resource === "radiation" ? "radiation" : "resource") : verdict.reason,
  };
  return next;
}

/** Campaign progress derived from saved records — never hardcoded. */
export function campaignProgress(activeMission, archived = []) {
  const rank = (record) => (record?.outcome?.type === "success" ? 2 : 1);
  const best = {};
  archived.forEach((record) => {
    const index = record?.missionIndex;
    if (!index) return;
    if (!best[index] || rank(record) > rank(best[index])) best[index] = record;
  });

  const rows = MISSIONS.map((def) => {
    const record = best[def.index];
    const completed = record?.outcome?.type === "success";
    const isActive = activeMission?.missionIndex === def.index;
    const previous = best[def.index - 1];
    const unlocked = def.index === 1 || previous?.outcome?.type === "success";

    let status = "locked";
    let days = 0;
    if (isActive) {
      status = "active";
      days = Math.max(0, Math.min(DAYS_PER_MISSION, activeMission.day - 1));
    } else if (completed) {
      status = "completed";
      days = DAYS_PER_MISSION;
    } else if (unlocked || record) {
      status = "available";
      const played = record?.dayHistory?.length ?? Math.max(0, (record?.outcome?.day || 1) - 1);
      days = record ? Math.max(0, Math.min(DAYS_PER_MISSION, played)) : 0;
    }

    return {
      index: def.index,
      id: def.id,
      title: def.title,
      subtitle: def.subtitle,
      accent: def.accent,
      status,
      unlocked: unlocked || Boolean(record) || isActive,
      days,
      record,
      score: record?.outcome?.score ?? null,
    };
  });

  const daysCompleted = rows.reduce((n, row) => n + row.days, 0);
  const missionsCompleted = rows.filter((row) => row.status === "completed").length;
  const current = activeMission
    ? rows.find((row) => row.index === activeMission.missionIndex)
    : rows.find((row) => row.status === "available") || rows.find((row) => row.status === "completed");

  return {
    rows,
    daysCompleted,
    daysTotal: CAMPAIGN_DAYS,
    missionsCompleted,
    missionsTotal: TOTAL_MISSIONS,
    current: current || null,
    currentDay: activeMission?.day || null,
  };
}

export { respondToMessage, requestInfo };
