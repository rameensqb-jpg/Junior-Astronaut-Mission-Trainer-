const KEYS = {
  profile: "luna.profile",
  active: "luna.active",
  missions: "luna.missions",
  achievements: "luna.achievements",
  demo: "luna.demo",
  classroom: "luna.classroom",
};

function safeGet(key) {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key, value) {
  if (typeof window === "undefined") return;
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked */
  }
}

export function readJSON(key, fallback) {
  const raw = safeGet(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  safeSet(key, value);
}

export const store = {
  getProfile: () => readJSON(KEYS.profile, null),
  setProfile: (profile) => writeJSON(KEYS.profile, profile),

  getActive: () => readJSON(KEYS.active, null),
  setActive: (mission) => writeJSON(KEYS.active, mission),
  clearActive: () => writeJSON(KEYS.active, null),

  getMissions: () => readJSON(KEYS.missions, []),
  addMission: (mission) => {
    const all = readJSON(KEYS.missions, []);
    const next = [{ ...mission, archivedAt: new Date().toISOString() }, ...all].slice(0, 12);
    writeJSON(KEYS.missions, next);
    return next;
  },

  getAchievements: () => readJSON(KEYS.achievements, {}),
  unlock: (ids) => {
    const current = readJSON(KEYS.achievements, {});
    const next = { ...current };
    ids.forEach((id) => {
      if (!next[id]) next[id] = { earnedAt: new Date().toISOString() };
    });
    writeJSON(KEYS.achievements, next);
    return next;
  },
};

export const storageKeys = KEYS;
