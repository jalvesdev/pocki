import { STORAGE_KEY } from './config.js';
import { validateGame } from './game.js';

export function loadGame(storage = localStorage) {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return { state: null, corrupt: false };
  try {
    const value = JSON.parse(raw);
    return validateGame(value) ? { state: value, corrupt: false } : { state: null, corrupt: true };
  } catch { return { state: null, corrupt: true }; }
}
export function saveGame(state, storage = localStorage) { storage.setItem(STORAGE_KEY, JSON.stringify(state)); }
export function clearGame(storage = localStorage) { storage.removeItem(STORAGE_KEY); }
