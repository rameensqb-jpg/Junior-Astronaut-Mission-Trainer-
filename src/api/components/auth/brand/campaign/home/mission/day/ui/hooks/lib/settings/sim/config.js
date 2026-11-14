export const MISSION_DAYS = 10;
export const CREW_SIZE = 4;

export const RESOURCES = {
  energy: { max: 520, unit: "kWh", warnPct: 0.35, critPct: 0.15 },
  oxygen: { max: 60, unit: "kg", warnPct: 0.4, critPct: 0.2 },
  water: { max: 320, unit: "L", warnPct: 0.3, critPct: 0.12 },
  food: { max: 150, unit: "kg", warnPct: 0.3, critPct: 0.12 },
};

/**
 * SIMULATION MODEL — simplified for play, documented for transparency.
 * Real-world references (shown in the app):
 *  - Oxygen: human consumption ≈ 0.84 kg O2 per person per day (NASA life-support references).
 *  - Water: ~3.4 L per person per day for drinking, food prep and hygiene (ISS-style recycling).
 *  - Electrolysis: ~1.1 L water per kg of oxygen.
 *  - Solar: 78 kWh/day rated array, modulated by panel condition and simulated sky conditions.
 *  - Radiation: a SIMPLIFIED dose-equivalent estimate (mSv-eq), not a measurement.
 *  - Food: 1.75 kg per person per day (dry mass equivalent).
 */
export const MODEL = {
  o2PerCrewDay: 0.84,
  waterPerCrewDay: 3.4,
  foodPerCrewDay: 1.75,
  waterPerKgO2: 1.1,
  waterRecovery: 0.88,
  greenhouseYield: 3.4,
  greenhouseWater: 7.5,
  greenhouseKwh: 9,
  solarRated: 96,
  baseLoad: 38,
  recycleKwh: 6,
  commsKwh: 4,
  o2KwhPerKg: 3.2,
  researchKwh: 11,
  shieldKwh: 6,
  baseDose: 0.24,
  doseEnvFactor: 0.52,
};

export const START = {
  energy: 300,
  oxygen: 26,
  water: 212,
  food: 58,
};

export const START_SYSTEMS = {
  panels: 92,
  lifeSupport: 96,
  recycler: 88,
  greenhouse: 84,
  comms: 90,
  rover: 80,
};

export const START_RADIATION = { exposure: 0, shield: 34, envIndex: 32 };

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/** Deterministic pseudo-random in [0,1) from seed + two salts. */
export function rand(seed, a, b = 0) {
  let x = Math.imul(seed | 0, 374761393) ^ Math.imul(a | 0, 668265263) ^ Math.imul(b | 0, 2246822519);
  x = Math.imul(x ^ (x >>> 13), 1274126177);
  x = (x ^ (x >>> 16)) >>> 0;
  return x / 4294967296;
}

export const CMD_UNITS = {
  energy: "kWh",
  oxygen: "kg",
  water: "L",
  food: "kg",
};

export const MODEL_NOTES = {
  radiation:
    "Crew exposure is a simplified dose-equivalent estimate in mSv-eq. Real lunar surface doses depend on shielding, solar activity and the solar cycle. Gameplay values are not NASA measurements.",
  oxygen:
    "Oxygen is recycled by the life-support system, which needs electricity and water. If power drops, oxygen production drops with it.",
  water:
    "Most water used by the crew is recovered by the recycler. Recovery needs working equipment and power.",
  energy:
    "The solar array produces less energy when panels are dusty, during storms, or when the outpost is in shadow.",
};
