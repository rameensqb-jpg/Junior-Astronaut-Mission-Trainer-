/**
 * Archived, curated NASA reference records used when the live DONKI service
 * cannot be reached. These are real, published observations — never invented —
 * and the UI always labels them as ARCHIVED rather than live.
 */
export const ARCHIVED_EVENTS = [
  {
    id: "archive-2017-09-06",
    beginTime: "2017-09-06T11:53Z",
    peakTime: "2017-09-06T12:02Z",
    classType: "X9.3",
    sourceLocation: "AR2673",
    note: "One of the largest flares of solar cycle 24, followed by a coronal mass ejection.",
    link: "https://science.nasa.gov/solar-system/space-weather/",
  },
  {
    id: "archive-2022-04-20",
    beginTime: "2022-04-20T03:41Z",
    peakTime: "2022-04-20T03:57Z",
    classType: "X2.2",
    sourceLocation: "AR2994",
    note: "An X-class flare observed by NASA's Solar Dynamics Observatory.",
    link: "https://science.nasa.gov/solar-system/space-weather/",
  },
  {
    id: "archive-2023-12-31",
    beginTime: "2023-12-31T21:55Z",
    peakTime: "2023-12-31T22:00Z",
    classType: "X5.0",
    sourceLocation: "AR3536",
    note: "A strong X-class flare near the end of 2023, observed by NASA missions.",
    link: "https://science.nasa.gov/solar-system/space-weather/",
  },
];

export const NASA_DATASETS = [
  {
    id: "donki",
    name: "NASA DONKI — Space Weather Database Of Notifications, Knowledge, Information",
    source: "NASA CCMC",
    link: "https://api.nasa.gov/",
    docs: "https://kauai.ccmc.gsfc.nasa.gov/DONKI/",
    measures: "Solar flares, coronal mass ejections and solar energetic particle events.",
    gameplay: "Sets the environmental risk index that drives your radiation choices and shelter decisions.",
  },
  {
    id: "osdr",
    name: "NASA Open Science Data Repository (OSDR)",
    source: "NASA Biological & Physical Sciences",
    link: "https://osdr.nasa.gov/",
    docs: "https://osdr.nasa.gov/bio/repo/search",
    measures: "Biological responses to spaceflight, including radiation and microgravity research in model organisms.",
    gameplay: "Informs the crew-fatigue and radiation-protection explanations. It does not provide live radiation readings.",
  },
  {
    id: "moon",
    name: "NASA Science — Moon",
    source: "NASA Science Mission Directorate",
    link: "https://science.nasa.gov/moon/",
    docs: "https://science.nasa.gov/moon/lunar-south-pole-region/",
    measures: "Lunar surface conditions, water ice, regolith and exploration of the south pole region.",
    gameplay: "Shapes the water-ice harvesting and dust-management scenarios.",
  },
  {
    id: "api",
    name: "NASA Open APIs",
    source: "NASA",
    link: "https://api.nasa.gov/",
    docs: "https://api.nasa.gov/",
    measures: "Public programmatic access to NASA datasets, including DONKI and imagery services.",
    gameplay: "Provides the live space-weather observations shown in the Observatory and used to seed solar events.",
  },
];
