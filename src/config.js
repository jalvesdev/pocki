export const STORAGE_KEY = 'pocki-save';
export const SCHEMA_VERSION = 1;
export const HOUR = 60 * 60 * 1000;
export const DAY = 24 * HOUR;
export const CONFIG = Object.freeze({
  hatch: 5 * 60 * 1000,
  babyDuration: HOUR,
  childEnds: DAY,
  teenEnds: 3 * DAY,
  hungerEvery: 3 * HOUR,
  happinessEvery: 4 * HOUR,
  poopEvery: 4 * HOUR,
  criticalSickAfter: 6 * HOUR,
  criticalDeathAfter: DAY,
  oldAgeStarts: 14 * DAY,
  medicineGap: 60 * 1000,
  oldAgeDeathAt: 21 * DAY,
  stages: {
    baby: { sleep: [20, 8] }, child: { sleep: [21, 8] },
    teen: { sleep: [22, 8] }, adult: { sleep: [22, 9] }
  }
});
