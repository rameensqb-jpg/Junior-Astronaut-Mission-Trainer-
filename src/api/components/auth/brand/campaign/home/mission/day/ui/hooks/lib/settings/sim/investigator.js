import { RESOURCES } from "./config";
import { getScenario } from "./scenarios";

const NAME_KEY = {
  energy: "res.energy",
  oxygen: "res.oxygen",
  water: "res.water",
  food: "res.food",
  radiation: "res.radiation",
};

/**
 * Builds a root-cause analysis from the recorded mission only.
 * Returns structured data; the UI renders it in the player's language.
 */
export function analyzeMission(mission) {
  const outcome = mission.outcome || {};
  const failDay = outcome.day || mission.day;
  const failResource = outcome.resource || null;

  const entries = mission.log || [];
  const reports = entries.filter((e) => e.type === "report");
  const choices = entries.filter((e) => e.type === "choice");
  const delayed = entries.filter((e) => e.type === "delayed");
  const warnings = entries.filter((e) => e.type === "warning");

  // First warning related to the failing resource
  const firstWarning = failResource
    ? warnings.find((w) => w.resource === failResource || (failResource === "energy" && w.resource === "power"))
    : null;

  // Decisions that pulled the failing resource down
  const contributing = choices
    .filter((c) => c.impact && typeof c.impact[failResource] === "number" && c.impact[failResource] < 0)
    .map((c) => {
      const scenario = getScenario(c.scenarioId);
      return {
        day: c.day,
        scenarioId: c.scenarioId,
        choiceId: c.choiceId,
        title: c.title || "",
        label: c.label || "",
        impact: c.impact,
        source: scenario?.source || "",
      };
    });

  // Environmental / delayed events that made it harder
  const aggravating = delayed
    .filter((d) => d.effects && typeof d.effects[failResource] === "number" && d.effects[failResource] < 0)
    .map((d) => ({ day: d.day, noteKey: d.noteKey, effects: d.effects, scenarioId: d.scenarioId }));

  const weakestSystem = Object.entries(mission.systems || {})
    .sort((a, b) => a[1] - b[1])
    .slice(0, 2)
    .map(([k, v]) => ({ key: k, value: Math.round(v) }));

  const lowest = Object.keys(RESOURCES)
    .map((k) => ({ key: k, pct: Math.round(((mission.resources?.[k] || 0) / RESOURCES[k].max) * 100) }))
    .sort((a, b) => a.pct - b.pct);

  return {
    failDay,
    failResource,
    failResourceKey: failResource ? NAME_KEY[failResource] : null,
    firstWarning,
    contributing,
    aggravating,
    weakestSystem,
    lowest,
    totalDecisions: choices.length,
    warningsCount: warnings.length,
  };
}

export function timeline(mission) {
  const events = [];
  (mission.log || []).forEach((entry, index) => {
    if (entry.type === "choice") {
      events.push({
        id: `c-${index}`,
        day: entry.day,
        type: "choice",
        scenarioId: entry.scenarioId,
        choiceId: entry.choiceId,
        title: entry.title || "",
        label: entry.label || "",
        before: entry.before,
        after: entry.after,
        impact: entry.impact,
      });
    } else if (entry.type === "delayed") {
      events.push({
        id: `d-${index}`,
        day: entry.day,
        type: "delayed",
        noteKey: entry.noteKey,
        effects: entry.effects,
        scenarioId: entry.scenarioId,
      });
    } else if (entry.type === "warning") {
      events.push({ id: `w-${index}`, day: entry.day, type: "warning", resource: entry.resource, level: entry.level });
    } else if (entry.type === "report") {
      events.push({ id: `r-${index}`, day: entry.day, type: "report", flows: entry.flows, warnings: entry.warnings, after: entry.after });
    }
  });
  return events.sort((a, b) => a.day - b.day);
}
