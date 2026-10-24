import { createGame, advanceGame, applyAction, getViewModel } from './game.js';
import { loadGame, saveGame, clearGame } from './storage.js';

const $ = id => document.getElementById(id);
const icons = [
  { id: 'meal', icon: '♨', label: 'Refeição' }, { id: 'treat', icon: '♥', label: 'Doce' },
  { id: 'play', icon: '⚽', label: 'Brincar' }, { id: 'light', icon: '☼', label: 'Luz' },
  { id: 'clean', icon: '✦', label: 'Limpar' }, { id: 'medicine', icon: '+', label: 'Medicina' },
  { id: 'status', icon: '▤', label: 'Status' }, { id: 'discipline', icon: '!', label: 'Disciplina' }
];
let { state, corrupt } = loadGame();
let selected = 0, mode = 'menu', playChoice = 'left', audioContext;
if (!state && !corrupt) state = createGame();
const save = () => { if (!corrupt) saveGame(state); };

function beep(freq = 560, duration = 0.06) {
  if (!state.soundEnabled) return;
  try {
    audioContext ??= new AudioContext();
    if (audioContext.state === 'suspended') audioContext.resume();
    const osc = audioContext.createOscillator(), gain = audioContext.createGain();
    osc.frequency.value = freq; gain.gain.setValueAtTime(0.045, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    osc.connect(gain); gain.connect(audioContext.destination); osc.start(); osc.stop(audioContext.currentTime + duration);
  } catch { /* audio is optional */ }
}

function render() {
  if (!state) return;
  state = advanceGame(state, Date.now());
  const vm = getViewModel(state);
  $('clock').textContent = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  $('stage-label').textContent = ({ egg:'OVO', baby:'BEBÊ', child:'CRIANÇA', teen:'ADOLESCENTE', adult:'ADULTO', dead:'FIM' })[vm.stage];
  $('alert').textContent = vm.alert ? '!' : '♡'; $('alert').classList.toggle('alert-on', vm.alert);
  const pet = $('pet'); pet.className = `pet ${vm.appearance} ${vm.asleep ? 'asleep' : ''} ${vm.sick ? 'sick' : ''}`;
  pet.setAttribute('aria-label', vm.stage === 'egg' ? 'Ovo Pocki' : vm.stage === 'dead' ? 'Pocki morreu' : `Pocki ${vm.stage}${vm.asleep ? ', dormindo' : ''}${vm.sick ? ', doente' : ''}`);
  $('pet-scene').classList.toggle('dead-scene', vm.stage === 'dead');
  $('sleep-z').textContent = vm.asleep && vm.lightsOn === false ? 'z z' : '';
  $('stats').innerHTML = vm.stage === 'egg' ? `<span>⏳ chocando</span>` : vm.stage === 'dead' ? `<span>Idade: ${Math.floor(vm.ageHours / 24)} dias</span>` :
    `<span>FOME ${'♥'.repeat(vm.hunger)}${'♡'.repeat(4-vm.hunger)}</span><span>FELICIDADE ${'♥'.repeat(vm.happiness)}${'♡'.repeat(4-vm.happiness)}</span>`;
  $('menu').hidden = mode === 'hidden' || vm.stage === 'dead';
  $('menu-row').innerHTML = icons.map((item, i) => `<button class="action-icon ${i === selected ? 'selected' : ''}" aria-label="${item.label}" title="${item.label}" tabindex="-1" data-index="${i}"><span>${item.icon}</span></button>`).join('');
  $('message').textContent = vm.feedback || (vm.stage === 'egg' ? 'Um novo amigo está a caminho.' : vm.stage === 'dead' ? `Pocki partiu (${vm.deathReason === 'neglect' ? 'negligência' : 'velhice'}).` : vm.asleep ? 'Pocki está dormindo.' : 'Oi! Vamos cuidar?');
  if (mode === 'status' && vm.stage !== 'egg') $('message').textContent = `IDADE ${Math.floor(vm.ageHours/24)}d ${vm.ageHours%24}h · PESO ${vm.weight} · FOME ${vm.hunger}/4 · FELIZ ${vm.happiness}/4 · DISC ${vm.discipline}/4 · ${vm.health.toUpperCase()}`;
  if (mode === 'play') $('message').textContent = `Adivinhe: ${playChoice === 'left' ? '← esquerda' : 'direita →'} · B confirma`;
  $('sound').innerHTML = `${state.soundEnabled ? '♫' : '♪'} <span>Som ${state.soundEnabled ? 'ligado' : 'desligado'}</span>`;
  $('sound').setAttribute('aria-label', state.soundEnabled ? 'Desativar sons' : 'Ativar sons');
  $('storage-warning').hidden = !corrupt;
  if (vm.stage === 'dead') {
    $('menu').hidden = true;
    $('message').innerHTML = `${vm.feedback || 'Pocki partiu.'}<br><button id="new-egg" class="new-egg">Começar novo ovo</button>`;
    $('new-egg').onclick = restart;
  }
}

function restart() {
  if (!confirm('Começar um novo ovo? A partida atual será apagada.')) return;
  clearGame(); corrupt = false; state = createGame(); mode = 'menu'; selected = 0; save(); render();
}
function press(key) {
  if (corrupt) return;
  state = advanceGame(state, Date.now()); beep(key === 'b' ? 720 : 510);
  if (state.stage === 'dead') { render(); return; }
  if (state.stage === 'egg') { if (key === 'b') state.feedback = 'O ovo ainda está chocando.'; render(); save(); return; }
  if (mode === 'play') {
    if (key === 'a') playChoice = playChoice === 'left' ? 'right' : 'left';
    if (key === 'b') { state = applyAction(state, 'play', Date.now(), playChoice); mode = 'menu'; }
    if (key === 'c') mode = 'menu';
  } else if (mode === 'status') { if (key === 'c' || key === 'b') mode = 'menu'; }
  else if (key === 'a') selected = (selected + 1) % icons.length;
  else if (key === 'c') { mode = 'menu'; state.feedback = ''; }
  else if (key === 'b') {
    const action = icons[selected].id;
    if (action === 'status') { mode = 'status'; state = applyAction(state, action); }
    else if (action === 'play') { mode = 'play'; playChoice = 'left'; state.feedback = ''; }
    else { state = applyAction(state, action); mode = 'menu'; }
  }
  save(); render();
}

document.querySelectorAll('.control').forEach(button => button.addEventListener('click', () => press(button.dataset.key)));
document.addEventListener('keydown', event => {
  const key = event.key.toLowerCase();
  if (['a','b','c'].includes(key) && !event.repeat) { event.preventDefault(); press(key); }
});
$('sound').addEventListener('click', () => { state.soundEnabled = !state.soundEnabled; if (state.soundEnabled) beep(820); save(); render(); });
$('reset-corrupt').addEventListener('click', () => {
  if (!confirm('O save corrompido será apagado. Criar um novo ovo?')) return;
  clearGame(); corrupt = false; state = createGame(); save(); render();
});
document.addEventListener('visibilitychange', () => { if (document.hidden) save(); else { state = advanceGame(state, Date.now()); save(); render(); } });
window.addEventListener('pagehide', save);
setInterval(() => { if (!document.hidden) { render(); save(); } }, 1000);
render();
