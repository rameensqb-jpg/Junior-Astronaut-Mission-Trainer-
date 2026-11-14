import { MODEL, RESOURCES, START, START_SYSTEMS, START_RADIATION, MISSION_DAYS, CREW_SIZE, clamp, rand } from "./config";

/**
 * Each scenario: { id, days, priority, repeatable, requires(s), source, choices[] }
 * choice: { id, bias, effects, delays[], flags? }
 * effects keys: energy, oxygen, water, food, research, shield, exposure,
 *               panels, lifeSupport, recycler, greenhouse, comms, rover
 * delays: { inDays, effects, flag?, noteKey }
 */
export const SCENARIOS = [
  {
    id: "research_window",
    days: [2],
    priority: 6,
    source: "NASA Science — Moon (lunar geology)",
    choices: [
      {
        id: "full",
        bias: 0,
        effects: { energy: -24, water: -14, research: 18, flags: ["researchPush"] },
        delays: [{ inDays: 3, effects: { energy: -14 }, noteKey: "dl.research_drain" }],
      },
      {
        id: "limited",
        bias: 2,
        effects: { energy: -11, water: -6, research: 9 },
        delays: [{ inDays: 2, effects: { research: 3 }, noteKey: "dl.research_modest" }],
      },
      { id: "conserve", bias: 1, effects: { energy: 8, research: 2 }, delays: [] },
    ],
  },
  {
    id: "panel_dust",
    days: [2, 3, 4],
    priority: 4,
    source: "NASA Science — Lunar dust and surface conditions",
    choices: [
      { id: "eva", bias: 0, effects: { energy: -9, panels: 16, exposure: 0.6 }, delays: [] },
      { id: "robot", bias: 2, effects: { energy: -5, panels: 9, rover: -4 }, delays: [] },
      {
        id: "wait",
        bias: 1,
        effects: { panels: -9 },
        delays: [{ inDays: 2, effects: { panels: -6 }, noteKey: "dl.dust_build" }],
      },
    ],
  },
  {
    id: "recycler_warning",
    days: [3, 4, 5],
    priority: 5,
    requires: () => true,
    source: "NASA — Water recovery and life support on the ISS",
    choices: [
      { id: "service", bias: 2, effects: { energy: -12, recycler: 18, water: -4 }, delays: [] },
      {
        id: "filter",
        bias: 1,
        effects: { water: -12, recycler: -5 },
        delays: [{ inDays: 2, effects: { recycler: -7 }, noteKey: "dl.filter_clog" }],
      },
      {
        id: "earth",
        bias: 0,
        effects: { comms: 4 },
        delays: [{ inDays: 2, effects: { recycler: 12, energy: -6 }, noteKey: "dl.earth_procedure" }],
      },
    ],
  },
  {
    id: "solar_storm",
    days: [4, 5, 6],
    priority: 9,
    source: "NASA DONKI — solar flare & CME observations",
    choices: [],
  },
  {
    id: "comms_fault",
    days: [4, 5, 6, 7],
    priority: 4,
    source: "NASA — Deep Space Network and lunar communication delay",
    choices: [
      { id: "reboot", bias: 1, effects: { energy: -10, comms: 15 }, delays: [] },
      { id: "backup", bias: 2, effects: { energy: -4, comms: 6 }, delays: [{ inDays: 1, effects: { comms: -4 }, noteKey: "dl.backup_weak" }] },
      {
        id: "defer",
        bias: 0,
        effects: { comms: -16 },
        delays: [{ inDays: 2, effects: { comms: -6 }, noteKey: "dl.comms_silent" }],
      },
    ],
  },
  {
    id: "greenhouse_mold",
    days: [3, 4, 5, 6],
    priority: 4,
    source: "NASA — Plant growth in space (Veggie & Advanced Plant Habitat)",
    choices: [
      { id: "isolate", bias: 1, effects: { food: -6, greenhouse: 12 }, delays: [] },
      { id: "clean", bias: 2, effects: { energy: -9, water: -12, food: -3, greenhouse: 20 }, delays: [] },
      {
        id: "continue",
        bias: 0,
        effects: { greenhouse: -8, flags: ["weakCrops"] },
        delays: [{ inDays: 2, effects: { food: -8 }, noteKey: "dl.crop_loss" }],
      },
    ],
  },
  {
    id: "rover_battery",
    days: [5, 6, 7],
    priority: 3,
    source: "NASA — Lunar roving and surface exploration",
    choices: [
      { id: "charge", bias: 0, effects: { energy: -16, rover: 10, research: 12 }, delays: [] },
      { id: "maintenance", bias: 2, effects: { rover: -6, panels: 10, energy: -4 }, delays: [] },
      { id: "skip", bias: 1, effects: { rover: -3, research: 1 }, delays: [] },
    ],
  },
  {
    id: "pressure_leak",
    days: [5, 6, 7, 8],
    priority: 8,
    source: "NASA — Habitat structures and pressure integrity",
    choices: [
      { id: "patch", bias: 1, effects: { energy: -8, oxygen: -4, lifeSupport: 6 }, delays: [] },
      {
        id: "monitor",
        bias: 0,
        effects: { lifeSupport: -4 },
        delays: [{ inDays: 2, effects: { oxygen: -7, lifeSupport: -6 }, noteKey: "dl.leak_grows" }],
      },
      { id: "isolate", bias: 2, effects: { oxygen: -1, greenhouse: -6 }, delays: [] },
    ],
  },
  {
    id: "shield_upgrade",
    days: [5, 6, 7, 8],
    priority: 5,
    source: "NASA — Radiation shielding concepts for lunar habitats",
    choices: [
      { id: "water_wall", bias: 2, effects: { water: -26, shield: 22, energy: -6 }, delays: [] },
      {
        id: "regolith",
        bias: 1,
        effects: { energy: -18, shield: 14, panels: -4 },
        delays: [{ inDays: 2, effects: { panels: -5 }, noteKey: "dl.regolith_dust" }],
      },
      { id: "defer", bias: 0, effects: { shield: -6, flags: ["lowShield"] }, delays: [{ inDays: 2, effects: { exposure: 1.2 }, noteKey: "dl.shield_gap" }] },
    ],
  },
  {
    id: "power_rationing",
    days: [5, 6, 7, 8],
    priority: 7,
    requires: (s) => s.resources.energy < RESOURCES.energy.max * 0.45 || s.flags.researchPush,
    source: "NASA — Power systems and load management on the ISS",
    choices: [
      {
        id: "dim_greenhouse",
        bias: 1,
        effects: { energy: 14, greenhouse: -4 },
        delays: [{ inDays: 2, effects: { food: -6 }, noteKey: "dl.grow_lights_off" }],
      },
      { id: "pause_research", bias: 2, effects: { energy: 12, research: -4 }, delays: [] },
      { id: "comms_windows", bias: 1, effects: { energy: 8, comms: -7 }, delays: [] },
      {
        id: "keep_all",
        bias: 0,
        effects: {},
        delays: [{ inDays: 2, effects: { energy: -18 }, noteKey: "dl.load_kept" }],
      },
    ],
  },
  {
    id: "water_emergency",
    days: [6, 7, 8, 9],
    priority: 8,
    requires: (s) => s.resources.water < RESOURCES.water.max * 0.42,
    source: "NASA — Lunar water ice at the Moon's south pole",
    choices: [
      { id: "recycle_hard", bias: 2, effects: { water: 20, recycler: -12, energy: -10 }, delays: [] },
      { id: "ice_eva", bias: 0, effects: { water: 34, exposure: 2.1, energy: -12, rover: 6 }, delays: [] },
      {
        id: "ration",
        bias: 1,
        effects: { water: 10, research: -5, flags: ["rationed"] },
        delays: [{ inDays: 2, effects: { lifeSupport: -5 }, noteKey: "dl.ration_stress" }],
      },
    ],
  },
  {
    id: "science_anomaly",
    days: [6, 7, 8, 9],
    priority: 4,
    requires: (s) => s.research >= 20,
    source: "NASA — Lunar seismic activity (Apollo seismometers)",
    choices: [
      { id: "array", bias: 0, effects: { energy: -14, research: 18 }, delays: [] },
      { id: "sample", bias: 2, effects: { energy: -6, research: 8, rover: -4 }, delays: [] },
      { id: "from_hab", bias: 1, effects: { research: 4 }, delays: [] },
    ],
  },
  {
    id: "supply_manifest",
    days: [4, 5, 6, 7, 8],
    priority: 4,
    source: "NASA — Cargo resupply and mission logistics",
    choices: [
      {
        id: "consumables",
        bias: 2,
        effects: { comms: -4 },
        delays: [{ inDays: 2, effects: { water: 26, oxygen: 6, food: 8 }, noteKey: "dl.resupply_consumables" }],
      },
      {
        id: "spares",
        bias: 1,
        effects: { comms: -3 },
        delays: [{ inDays: 2, effects: { recycler: 10, lifeSupport: 8 }, noteKey: "dl.resupply_spares" }],
      },
      { id: "decline", bias: 0, effects: { energy: 8, research: 3 }, delays: [] },
    ],
  },
  {
    id: "crew_fatigue",
    days: [6, 7, 8, 9],
    priority: 4,
    source: "NASA OSDR — human health and performance in spaceflight",
    choices: [
      { id: "rest", bias: 2, effects: { research: -6, energy: 6, lifeSupport: 3 }, delays: [] },
      { id: "rotate", bias: 1, effects: { research: -2, energy: -4 }, delays: [] },
      {
        id: "push",
        bias: 0,
        effects: { research: 8, lifeSupport: -4 },
        delays: [{ inDays: 2, effects: { lifeSupport: -6 }, noteKey: "dl.fatigue" }],
      },
    ],
  },
  {
    id: "flare_watch",
    days: [7, 8, 9],
    priority: 8,
    source: "NASA DONKI — solar energetic particle events",
    choices: [
      { id: "shelter", bias: 2, effects: { energy: -12, shield: 16, research: -5 }, delays: [] },
      { id: "harden", bias: 1, effects: { energy: -7, comms: 4, exposure: 0.4 }, delays: [] },
      {
        id: "ignore",
        bias: 0,
        effects: { exposure: 2.8, research: 4 },
        delays: [{ inDays: 1, effects: { exposure: 1.6 }, noteKey: "dl.flare_after" }],
      },
    ],
  },
  {
    id: "harvest",
    days: [8, 9, 10],
    priority: 5,
    source: "NASA — Vegetable production on the ISS (Veggie)",
    choices: [
      { id: "harvest_now", bias: 1, effects: { food: 24, water: -10 }, delays: [] },
      {
        id: "wait",
        bias: 2,
        effects: { water: -6 },
        delays: [{ inDays: 2, effects: { food: 34 }, noteKey: "dl.harvest_later" }],
      },
      { id: "share", bias: 0, effects: { food: 8, research: 12, energy: -5 }, delays: [] },
    ],
  },
];

// The solar storm scenario needs a custom shape built with today's NASA context.
SCENARIOS[3] = {
  id: "solar_storm",
  days: [4, 5, 6],
  priority: 9,
  source: "NASA DONKI — Solar Flare (FLR) and Coronal Mass Ejection (CME) records",
  choices: [
    {
      id: "full_shelter",
      bias: 2,
      effects: { energy: -14, shield: 24, research: -6, exposure: 0.2 },
      delays: [{ inDays: 2, effects: { energy: -8 }, noteKey: "dl.shelter_power" }],
    },
    {
      id: "partial",
      bias: 1,
      effects: { energy: -8, shield: 12, exposure: 1.1 },
      delays: [],
    },
    {
      id: "keep_working",
      bias: 0,
      effects: { research: 9, exposure: 2.6, panels: -6 },
      delays: [{ inDays: 2, effects: { exposure: 1.4, panels: -6 }, noteKey: "dl.storm_exposure" }],
    },
  ],
};

export function getScenario(id) {
  return SCENARIOS.find((s) => s.id === id) || null;
}

export function pickScenario(state) {
  const candidates = SCENARIOS.filter((sc) => {
    if (!sc.days.includes(state.day)) return false;
    if (state.usedScenarios.includes(sc.id)) return false;
    return sc.requires ? sc.requires(state) : true;
  });
  if (!candidates.length) return null;
  const highest = Math.max(...candidates.map((c) => c.priority || 1));
  const top = candidates.filter((c) => (c.priority || 1) === highest);
  const r = rand(state.seed, state.day, 17);
  return top[Math.min(top.length - 1, Math.floor(r * top.length))].id;
}
