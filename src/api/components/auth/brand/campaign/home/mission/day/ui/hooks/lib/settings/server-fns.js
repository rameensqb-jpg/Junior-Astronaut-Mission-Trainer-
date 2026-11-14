import { createServerFn } from "@tanstack/react-start";
import { secrets } from "base44:runtime";
import { ARCHIVED_EVENTS, NASA_DATASETS } from "@/lib/sim/nasaArchive";

export const getServerInfo = createServerFn({ method: "GET" }).handler(async () => ({
  renderedAt: new Date().toISOString(),
}));

function isoDate(daysAgo) {
  const d = new Date(Date.now() - daysAgo * 86400000);
  return d.toISOString().slice(0, 10);
}

/**
 * Live NASA DONKI solar-flare observations, with a labelled archived fallback.
 * The result describes observations only — it never claims to be a radiation
 * dose measured at the lunar surface.
 */
export const getSpaceWeather = createServerFn({ method: "GET" }).handler(async () => {
  const startDate = isoDate(30);
  const endDate = isoDate(0);
  const retrievedAt = new Date().toISOString();

  // The public NASA demo key works without configuration; a project key can
  // override it. Either way a failure below falls back to labelled archive data.
  let key = "DEMO_KEY";
  try {
    key = secrets.get("NASA_API_KEY") || "DEMO_KEY";
  } catch {
    key = "DEMO_KEY";
  }

  try {
    const url = `https://api.nasa.gov/DONKI/FLR?startDate=${startDate}&endDate=${endDate}&api_key=${encodeURIComponent(key)}`;
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`DONKI responded ${response.status}`);
    const rows = await response.json();
    const events = (Array.isArray(rows) ? rows : [])
      .map((r) => ({
        id: r.flrID || r.associatedCMEID || `${r.beginTime}-${r.classType}`,
        beginTime: r.beginTime || r.peakTime || null,
        peakTime: r.peakTime || null,
        classType: r.classType || null,
        sourceLocation: r.sourceLocation || null,
        note: r.note || null,
        link: r.link || "https://science.nasa.gov/solar-system/space-weather/",
      }))
      .filter((e) => e.beginTime)
      .sort((a, b) => (a.beginTime < b.beginTime ? 1 : -1))
      .slice(0, 8);

    return {
      status: "live",
      sourceId: "donki",
      dataset: "NASA DONKI — Solar Flare (FLR)",
      source: "NASA CCMC via api.nasa.gov",
      link: "https://api.nasa.gov/",
      range: { startDate, endDate },
      retrievedAt,
      events,
      datasets: NASA_DATASETS,
      note:
        "Live observations of solar flares. A flare is an electromagnetic observation — it is not a radiation dose measured at the lunar surface.",
    };
  } catch (error) {
    return {
      status: "archived",
      sourceId: "donki",
      dataset: "NASA DONKI — Solar Flare (FLR) · archived reference records",
      source: "NASA Science / DONKI published records",
      link: "https://science.nasa.gov/solar-system/space-weather/",
      range: { startDate, endDate },
      retrievedAt,
      events: ARCHIVED_EVENTS,
      datasets: NASA_DATASETS,
      error: String(error && error.message ? error.message : error),
      note:
        "The live service could not be reached, so curated published NASA observations are shown instead. They are labelled as archived and are not live data.",
    };
  }
});
