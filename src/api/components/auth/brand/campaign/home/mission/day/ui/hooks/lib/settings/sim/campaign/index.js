import m1 from "./m1";
import m2 from "./m2";
import m3 from "./m3";
import m4 from "./m4";
import m5 from "./m5";
import m6 from "./m6";
import m7 from "./m7";

export const MISSIONS = [m1, m2, m3, m4, m5, m6, m7];

export const DAYS_PER_MISSION = 10;
export const TOTAL_MISSIONS = MISSIONS.length;
export const CAMPAIGN_DAYS = TOTAL_MISSIONS * DAYS_PER_MISSION;

export const getMission = (index) => MISSIONS.find((m) => m.index === Number(index)) || MISSIONS[0];

export const getMissionDay = (index, day) => {
  const mission = getMission(index);
  const clamped = Math.min(Math.max(1, Number(day) || 1), DAYS_PER_MISSION);
  return mission.days[clamped - 1];
};

export const totalObjectives = MISSIONS.reduce(
  (sum, mission) => sum + mission.days.reduce((n, day) => n + 5, 0),
  0
);
