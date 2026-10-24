import { CONFIG, HOUR, DAY, SCHEMA_VERSION } from './config.js';

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const clone = s => ({ ...s });
const living = s => s.stage !== 'dead';
const ageAt = (s, at) => s.hatchedAt == null ? 0 : Math.max(0, at - s.hatchedAt);

export function createGame(now = Date.now()) {
  return {
    schemaVersion: SCHEMA_VERSION, createdAt: now, hatchedAt: null, lastProcessedAt: now,
    stage: 'egg', health: 'healthy', hunger: 3, happiness: 3, weight: 5, discipline: 0,
    poopCount: 0, lightsOn: true, sick: false, medicineDoses: 0, lastMedicineAt: null,
    criticalSince: null, careMistakes: 0, unjustifiedCallAt: null,
    unjustifiedCallHandled: false, deathReason: null, soundEnabled: false,
    nextHungerAt: null, nextHappinessAt: null, nextPoopAt: null, nextCallAt: null,
    nextOldAgeAt: null, adultForm: null, gameChoice: 'left', pendingCall: false
  };
}

function setStage(s, at) {
  if (s.hatchedAt == null) return;
  const age = ageAt(s, at);
  const stage = age < CONFIG.babyDuration ? 'baby' : age < CONFIG.childEnds ? 'child' : age < CONFIG.teenEnds ? 'teen' : 'adult';
  if (stage !== s.stage) {
    s.stage = stage;
    if (stage === 'adult') s.adultForm = s.careMistakes <= 2 ? 'sun' : 'moon';
  }
}

function sleeping(s, at) {
  if (!['baby', 'child', 'teen', 'adult'].includes(s.stage)) return false;
  const [start, end] = CONFIG.stages[s.stage].sleep;
  const hour = new Date(at).getHours();
  return start > end ? hour >= start || hour < end : hour >= start && hour < end;
}
function critical(s) { return s.hunger === 0 || s.poopCount >= 3; }

function die(s, reason, at) {
  s.stage = 'dead'; s.health = 'dead'; s.sick = false; s.deathReason = reason;
  s.deadAt = at;
}

function nextSleepBoundary(at) {
  const d = new Date(at); d.setMinutes(0, 0, 0); d.setHours(d.getHours() + 1);
  return d.getTime();
}

// Process scheduled events in timestamp order. Hour boundaries are the only
// additional events needed for local-time sleep and light care tracking.
export function advanceGame(input, now = Date.now()) {
  const s = clone(input);
  if (now < s.lastProcessedAt) return s;
  let cursor = s.lastProcessedAt;
  let iterations = 0;
  while (living(s) && iterations++ < 20000) {
    const due = [s.hatchedAt == null ? s.createdAt + CONFIG.hatch : null,
      s.nextHungerAt, s.nextHappinessAt, s.nextPoopAt, s.criticalSince == null ? null : s.criticalSince + CONFIG.criticalSickAfter,
      s.criticalSince == null ? null : s.criticalSince + CONFIG.criticalDeathAfter,
      s.nextCallAt, s.nextOldAgeAt,
      s.hatchedAt != null ? nextSleepBoundary(cursor) : null];
    const t = Math.min(...due.filter(x => x != null && x > cursor));
    if (!Number.isFinite(t) || t > now) break;
    // Score each completed local hour once, even when other events occur inside it.
    const hourBoundary = nextSleepBoundary(cursor);
    if (s.hatchedAt != null && t === hourBoundary && sleeping(s, cursor) && s.lightsOn) s.careMistakes++;
    cursor = t;
    if (s.hatchedAt == null && t === s.createdAt + CONFIG.hatch) {
      s.hatchedAt = t; s.stage = 'baby';
      s.nextHungerAt = t + CONFIG.hungerEvery; s.nextHappinessAt = t + CONFIG.happinessEvery;
      s.nextPoopAt = t + CONFIG.poopEvery; s.nextCallAt = t + 8 * HOUR;
      s.nextOldAgeAt = t + CONFIG.oldAgeDeathAt;
    }
    setStage(s, t);
    if (t === s.nextHungerAt) { s.hunger = clamp(s.hunger - 1, 0, 4); s.nextHungerAt += CONFIG.hungerEvery; }
    if (t === s.nextHappinessAt) { s.happiness = clamp(s.happiness - 1, 0, 4); s.nextHappinessAt += CONFIG.happinessEvery; }
    if (t === s.nextPoopAt) { s.poopCount = clamp(s.poopCount + 1, 0, 3); s.nextPoopAt += CONFIG.poopEvery; }
    if (s.nextCallAt === t) {
      if (s.unjustifiedCallAt != null && !s.unjustifiedCallHandled) s.careMistakes++;
      if (s.hunger > 0 && s.happiness > 0 && s.poopCount === 0) {
        s.unjustifiedCallAt = t; s.unjustifiedCallHandled = false; s.pendingCall = true;
      }
      s.nextCallAt += 8 * HOUR;
    }
    if (s.criticalSince == null && critical(s)) { s.criticalSince = t; s.careMistakes++; }
    if (!critical(s)) s.criticalSince = null;
    if (s.criticalSince != null && !s.sick && t >= s.criticalSince + CONFIG.criticalSickAfter) { s.sick = true; s.health = 'sick'; }
    if (s.criticalSince != null && t >= s.criticalSince + CONFIG.criticalDeathAfter) { die(s, 'neglect', t); break; }
    if (s.nextOldAgeAt === t && ageAt(s, t) >= CONFIG.oldAgeDeathAt) { die(s, 'old-age', t); break; }
  }
  if (living(s)) {
    setStage(s, now);
  }
  s.lastProcessedAt = now;
  return s;
}

export function applyAction(input, action, now = Date.now(), choice = 'left') {
  const s = advanceGame(input, now);
  if (!living(s) || s.stage === 'egg') return { ...s, feedback: s.stage === 'egg' ? 'O ovo ainda está chocando.' : 'A partida terminou.' };
  switch (action) {
    case 'meal': if (s.hunger < 4) { s.hunger++; s.weight = clamp(s.weight + 1, 5, 30); s.feedback = 'Refeição servida.'; } else s.feedback = 'Não está com fome.'; break;
    case 'treat':
      if (s.happiness < 4) { s.happiness++; s.weight = clamp(s.weight + 1, 5, 30); if (s.weight >= 20) s.careMistakes++; s.feedback = 'Doce servido.'; }
      else s.feedback = 'Já está feliz.'; break;
    case 'play':
      if (s.gameChoice === choice) { s.happiness = clamp(s.happiness + 1, 0, 4); s.feedback = 'Você venceu!'; }
      else s.feedback = 'Dessa vez não. Tente novamente.';
      s.weight = clamp(s.weight - 1, 5, 30); s.gameChoice = s.gameChoice === 'left' ? 'right' : 'left'; break;
    case 'light': s.lightsOn = !s.lightsOn; s.feedback = s.lightsOn ? 'Luz acesa.' : 'Luz apagada.'; break;
    case 'clean': if (s.poopCount) { s.poopCount = 0; s.feedback = 'Tudo limpo.'; } else s.feedback = 'Está tudo limpo.'; break;
    case 'medicine':
      if (!s.sick) s.feedback = 'Não precisa de medicina.';
      else if (s.poopCount >= 3) s.feedback = 'Limpe antes de medicar.';
      else if (s.lastMedicineAt != null && now - s.lastMedicineAt < CONFIG.medicineGap) s.feedback = 'Espere um minuto entre doses.';
      else { s.medicineDoses++; s.lastMedicineAt = now; if (s.medicineDoses >= 2) { s.sick = false; s.health = 'healthy'; s.criticalSince = null; s.medicineDoses = 0; } s.feedback = 'Dose aplicada.'; }
      break;
    case 'discipline':
      if (s.pendingCall || (s.unjustifiedCallAt != null && !s.unjustifiedCallHandled)) {
        s.discipline = clamp(s.discipline + 1, 0, 4); s.unjustifiedCallHandled = true; s.pendingCall = false; s.feedback = 'Boa disciplina.';
      } else { s.careMistakes++; s.discipline = clamp(s.discipline - 1, 0, 4); s.feedback = 'Não havia motivo para repreender.'; }
      break;
    case 'status': s.feedback = 'Status atualizado.'; break;
    default: s.feedback = 'Ação indisponível.';
  }
  if (!critical(s)) s.criticalSince = null;
  else if (s.criticalSince == null) { s.criticalSince = now; s.careMistakes++; }
  s.lastProcessedAt = now;
  return s;
}

export function getViewModel(state, now = Date.now()) {
  const s = advanceGame(state, now);
  return { ...s, ageHours: Math.floor(ageAt(s, now) / HOUR), asleep: sleeping(s, now), critical: critical(s),
    appearance: s.stage === 'adult' ? s.adultForm : s.stage, alert: s.pendingCall || critical(s),
    statusText: `${s.stage} · ${s.health} · fome ${s.hunger}/4 · felicidade ${s.happiness}/4 · disciplina ${s.discipline}/4` };
}

export function validateGame(value) {
  if (!value || value.schemaVersion !== SCHEMA_VERSION || !['egg','baby','child','teen','adult','dead'].includes(value.stage)) return false;
  return Number.isFinite(value.createdAt) && Number.isFinite(value.lastProcessedAt) &&
    [value.hunger,value.happiness].every(n => Number.isInteger(n) && n >= 0 && n <= 4) &&
    Number.isInteger(value.weight) && value.weight >= 5 && value.weight <= 30 &&
    Number.isInteger(value.discipline) && value.discipline >= 0 && value.discipline <= 4 &&
    Number.isInteger(value.poopCount) && value.poopCount >= 0 && value.poopCount <= 3;
}
