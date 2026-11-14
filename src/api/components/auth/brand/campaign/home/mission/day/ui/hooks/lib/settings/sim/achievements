export const ACHIEVEMENTS = [
  { id: "planner", icon: "battery" },
  { id: "storm", icon: "sun" },
  { id: "research", icon: "microscope" },
  { id: "comms", icon: "radio" },
  { id: "sustainable", icon: "leaf" },
  { id: "investigator", icon: "search" },
];

const SYSTEM_KEYS = ["panels", "lifeSupport", "recycler", "greenhouse", "comms", "rover"];

export function evaluateAchievements(mission, extra = {}) {
  if (!mission) return [];
  const earned = [];
  const reports = (mission.log || []).filter((e) => e.type === "report");
  const lowestEnergyPct = Math.min(
    ...reports.map((r) => (r.after ? r.after.energy / 520 : 1)),
    mission.resources.energy / 520
  );
  const lowestWaterPct = Math.min(
    ...reports.map((r) => (r.after ? r.after.water / 320 : 1)),
    mission.resources.water / 320
  );

  if (lowestEnergyPct > 0.22 && lowestWaterPct > 0.18) earned.push("planner");

  const stormChoice = (mission.decisions || []).find(
    (d) => (d.scenarioId === "solar_storm" || d.scenarioId === "flare_watch") &&
      ["full_shelter", "shelter", "partial", "harden"].includes(d.choiceId)
  );
  if (stormChoice) earned.push("storm");

  if (mission.research >= 55) earned.push("research");

  const responded = (mission.messages || []).filter((m) => m.from === "control" && m.answered).length;
  if (responded >= 3 || (extra.requests || 0) >= 3) earned.push("comms");

  if (mission.outcome?.type === "success") {
    const avg = SYSTEM_KEYS.reduce((sum, k) => sum + mission.systems[k], 0) / SYSTEM_KEYS.length;
    if (avg > 45) earned.push("sustainable");
  }

  if (extra.investigated) earned.push("investigator");

  return earned;
}

export function strategyCategory(mission) {
  const decisions = mission.decisions || [];
  let research = 0;
  let protection = 0;
  let conservation = 0;

  decisions.forEach((d) => {
    if (d.impact?.research > 5) research += 1;
    if (d.impact?.shield > 0 || d.impact?.exposure < 0) protection += 1;
    if (d.impact?.energy > 0 || d.impact?.water > 0) conservation += 1;
    if (d.scenarioId === "solar_storm" || d.scenarioId === "flare_watch" || d.scenarioId === "shield_upgrade") protection += 1;
  });

  const max = Math.max(research, protection, conservation);
  if (max === 0 || (research >= 2 && protection >= 2)) return "balanced";
  if (max === research) return "research";
  if (max === protection) return "protection";
  return "resource";
}
