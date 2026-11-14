export const EFFECT_KEYS = {
  energy: "res.energy",
  oxygen: "res.oxygen",
  water: "res.water",
  food: "res.food",
  research: "res.research",
  shield: "res.shield",
  exposure: "env.exposure",
  panels: "sys.panels",
  lifeSupport: "sys.lifeSupport",
  recycler: "sys.recycler",
  greenhouse: "sys.greenhouse",
  comms: "sys.comms",
  rover: "sys.rover",
};

export const EFFECT_UNITS = {
  energy: "kWh",
  oxygen: "kg",
  water: "L",
  food: "kg",
  research: "",
  shield: "%",
  exposure: "mSv-eq",
  panels: "%",
  lifeSupport: "%",
  recycler: "%",
  greenhouse: "%",
  comms: "%",
  rover: "%",
};

export function effectList(effects = {}) {
  return Object.keys(effects)
    .filter((k) => EFFECT_KEYS[k] && typeof effects[k] === "number" && effects[k] !== 0)
    .map((k) => ({
      key: EFFECT_KEYS[k],
      unit: EFFECT_UNITS[k],
      value: effects[k],
      positive: k === "exposure" ? effects[k] < 0 : effects[k] > 0,
    }));
}

export const RESOURCE_LABEL = {
  energy: "res.energy",
  oxygen: "res.oxygen",
  water: "res.water",
  food: "res.food",
  radiation: "res.radiation",
  comms: "res.comms",
  power: "res.power",
  recycler: "sys.recycler",
};

export const SYSTEM_LABEL = {
  panels: "sys.panels",
  lifeSupport: "sys.lifeSupport",
  recycler: "sys.recycler",
  greenhouse: "sys.greenhouse",
  comms: "sys.comms",
  rover: "sys.rover",
};

export function statusOf(ratio) {
  if (ratio <= 0.15) return "critical";
  if (ratio <= 0.35) return "caution";
  return "stable";
}
