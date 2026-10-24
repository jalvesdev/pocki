import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, advanceGame, applyAction, getViewModel, validateGame } from '../src/game.js';
import { HOUR, DAY } from '../src/config.js';

const base = Date.UTC(2026, 0, 1, 12);
const hatch = at => advanceGame(createGame(at), at + 5 * 60_000);
const pauseNeeds = s => ({ ...s, hunger: 4, happiness: 4, poopCount: 0, nextHungerAt: null,
  nextHappinessAt: null, nextPoopAt: null, nextCallAt: null, nextOldAgeAt: null });

test('egg hatches at five minutes and stage timing uses hatch age', () => {
  let s = createGame(base);
  assert.equal(advanceGame(s, base + 299_999).stage, 'egg');
  s = advanceGame(s, base + 300_000);
  assert.equal(s.stage, 'baby');
  s = pauseNeeds(s);
  assert.equal(advanceGame(s, s.hatchedAt + HOUR).stage, 'child');
  assert.equal(advanceGame(s, s.hatchedAt + DAY).stage, 'teen');
  assert.equal(advanceGame(s, s.hatchedAt + 3 * DAY).stage, 'adult');
});

test('advance is idempotent at the same instant and rejects clock rollback', () => {
  const s = hatch(base);
  const t = s.hatchedAt + 9 * HOUR + 321;
  const once = advanceGame(s, t), twice = advanceGame(once, t);
  assert.deepEqual(twice, once);
  assert.deepEqual(advanceGame(once, t - 1), once);
});

test('hunger, happiness, weight and discipline remain in bounds', () => {
  let s = hatch(base); const at = s.hatchedAt + 12 * HOUR;
  s = applyAction(s, 'meal', at); assert.equal(s.hunger, 1);
  s = applyAction(s, 'meal', at); assert.equal(s.hunger, 2);
  s = applyAction(s, 'discipline', at); assert.equal(s.discipline, 0);
  assert.ok(s.careMistakes >= 1);
  assert.ok(validateGame(s));
});

test('care actions have their intended effects and limits', () => {
  let s = hatch(base); let at = s.hatchedAt + 1;
  s = { ...s, hunger: 3, happiness: 2, poopCount: 2, weight: 29 };
  s = applyAction(s, 'meal', at); assert.equal(s.hunger, 4); assert.equal(s.weight, 30);
  s = applyAction(s, 'treat', at + 1); assert.equal(s.happiness, 3);
  s = applyAction(s, 'clean', at + 2); assert.equal(s.poopCount, 0);
  const light = s.lightsOn; s = applyAction(s, 'light', at + 3); assert.equal(s.lightsOn, !light);
  s = { ...s, happiness: 3, gameChoice: 'left' };
  s = applyAction(s, 'play', at + 4, 'left'); assert.equal(s.happiness, 4);
  assert.equal(s.weight, 29);
});

test('critical hunger causes illness after six hours and death after 24', () => {
  let s = hatch(base); s = { ...s, hunger: 0, criticalSince: s.hatchedAt };
  s = advanceGame(s, s.hatchedAt + 6 * HOUR);
  assert.equal(s.sick, true);
  const dead = advanceGame(s, s.hatchedAt + DAY);
  assert.equal(dead.stage, 'dead'); assert.equal(dead.deathReason, 'neglect');
});

test('cleaning resolves the dirty critical condition; medicine requires two doses', () => {
  let s = hatch(base); s = { ...s, poopCount: 3, criticalSince: s.hatchedAt, sick: true, health: 'sick' };
  s = applyAction(s, 'clean', s.hatchedAt + 7 * HOUR);
  assert.equal(s.criticalSince, null); assert.equal(s.sick, true);
  s = { ...s, hunger: 1, criticalSince: s.lastProcessedAt, sick: true, health: 'sick', poopCount: 0 };
  const t = s.lastProcessedAt + 1;
  s = applyAction(s, 'medicine', t); assert.equal(s.medicineDoses, 1);
  s = applyAction(s, 'medicine', t + 60_000); assert.equal(s.sick, false);
});

test('adult appearance depends on accumulated care mistakes', () => {
  let s = { ...pauseNeeds(hatch(base)), careMistakes: 0, lightsOn: false };
  assert.equal(advanceGame(s, s.hatchedAt + 3 * DAY).adultForm, 'sun');
  s = { ...s, careMistakes: 3, stage: 'teen' };
  assert.equal(advanceGame(s, s.hatchedAt + 3 * DAY).adultForm, 'moon');
});

test('continuous and offline advance converge on the same scheduled state', () => {
  const s = hatch(base), end = s.hatchedAt + 20 * HOUR;
  let continuous = s;
  for (let t = s.hatchedAt + HOUR; t <= end; t += HOUR) continuous = advanceGame(continuous, t);
  const offline = advanceGame(s, end);
  for (const key of ['stage','hunger','happiness','weight','poopCount','criticalSince','sick','careMistakes']) assert.equal(offline[key], continuous[key], key);
});

test('old age has a deterministic documented endpoint', () => {
  const s = hatch(base);
  s.hunger = 4; s.happiness = 4; s.poopCount = 0;
  s.nextHungerAt = null; s.nextHappinessAt = null; s.nextPoopAt = null; s.nextCallAt = null;
  const old = advanceGame(s, s.hatchedAt + 21 * DAY);
  assert.equal(old.stage, 'dead'); assert.equal(old.deathReason, 'old-age');
});

test('view model exposes local sleep and alert information', () => {
  const s = hatch(base);
  const vm = getViewModel(s, s.hatchedAt + 1);
  assert.equal(typeof vm.asleep, 'boolean'); assert.equal(vm.alert, false);
  assert.match(vm.statusText, /fome/);
});
