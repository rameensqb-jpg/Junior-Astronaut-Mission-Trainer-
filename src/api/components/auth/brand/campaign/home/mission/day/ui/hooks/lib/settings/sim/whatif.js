import { clone, resolveChoice, advanceDay } from "./engine";
import { getScenario } from "./scenarios";

/**
 * Runs an alternative branch from a recorded decision without touching the
 * original mission. After the changed choice, remaining days are auto-piloted
 * with the most balanced option (choice.bias), which is clearly labelled in the UI.
 */
export function simulateAlternative(mission, decisionIndex, alternativeChoiceId) {
  const decision = mission.decisions?.[decisionIndex];
  if (!decision) return null;

  const scenario = getScenario(decision.scenarioId);
  if (!scenario) return null;

  let state = clone(decision.stateBefore);
  state.activeScenario = decision.scenarioId;
  state = resolveChoice(state, alternativeChoiceId);

  let guard = 0;
  while (state.phase === "active" && guard < 20) {
    if (state.activeScenario) {
      const sc = getScenario(state.activeScenario);
      const auto = [...sc.choices].sort((a, b) => (b.bias || 0) - (a.bias || 0))[0];
      state = resolveChoice(state, auto.id);
    }
    state = advanceDay(state);
    guard += 1;
  }

  return {
    outcome: state.outcome,
    days: state.outcome?.day || state.day,
    resources: {
      energy: Math.round(state.resources.energy),
      oxygen: Math.round(state.resources.oxygen * 10) / 10,
      water: Math.round(state.resources.water),
      food: Math.round(state.resources.food * 10) / 10,
    },
    research: Math.round(state.research),
    exposure: Math.round(state.radiation.exposure * 100) / 100,
    scenarioId: decision.scenarioId,
    originalChoiceId: decision.choiceId,
    alternativeChoiceId,
  };
}

/** Outcome of the mission as recorded, for side-by-side comparison. */
export function originalSummary(mission) {
  return {
    outcome: mission.outcome,
    days: mission.outcome?.day || mission.day,
    resources: {
      energy: Math.round(mission.resources.energy),
      oxygen: Math.round(mission.resources.oxygen * 10) / 10,
      water: Math.round(mission.resources.water),
      food: Math.round(mission.resources.food * 10) / 10,
    },
    research: Math.round(mission.research),
    exposure: Math.round(mission.radiation.exposure * 100) / 100,
    scenarioId: null,
    originalChoiceId: null,
    alternativeChoiceId: null,
  };
}
