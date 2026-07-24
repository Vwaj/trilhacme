/* ============================================================
   sounds.js — Efeitos sonoros sintetizados (sem música de fundo)
   Tudo gerado por código via Web Audio API — sem arquivos de
   áudio externos, sem dependências.
   ============================================================ */

let audioCtx = null;
let sfxEnabled = true;

const AUDIO_PREF_KEY = "estudapp_audio_v3";

function loadAudioPref() {
  try {
    const raw = localStorage.getItem(AUDIO_PREF_KEY);
    if (raw !== null) {
      const p = JSON.parse(raw);
      sfxEnabled = p.sfxEnabled !== undefined ? p.sfxEnabled : true;
    }
  } catch (e) { /* mantém padrão */ }
}
function saveAudioPref() {
  try { localStorage.setItem(AUDIO_PREF_KEY, JSON.stringify({ sfxEnabled })); } catch (e) {}
}
loadAudioPref();

function ensureAudioCtx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
  return audioCtx;
}

/* toca uma nota simples com envelope (ataque rápido, decaimento suave) */
function playTone(freq, startTime, duration, type = "square", gain = 0.12) {
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, startTime);
  g.gain.linearRampToValueAtTime(gain, startTime + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  osc.connect(g).connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.03);
}

function sfxCorrect() {
  if (!sfxEnabled) return;
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  playTone(523.25, t, 0.12, "square", 0.13);
  playTone(659.25, t + 0.09, 0.12, "square", 0.13);
  playTone(783.99, t + 0.18, 0.20, "square", 0.15);
}

function sfxWrong() {
  if (!sfxEnabled) return;
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  playTone(220.0, t, 0.16, "sawtooth", 0.10);
  playTone(174.61, t + 0.13, 0.24, "sawtooth", 0.10);
}

function sfxLevelUp() {
  if (!sfxEnabled) return;
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => playTone(f, t + i * 0.1, 0.18, "square", 0.15));
}

function sfxComplete() {
  if (!sfxEnabled) return;
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  [392.0, 523.25, 659.25].forEach((f, i) => playTone(f, t + i * 0.13, 0.22, "triangle", 0.14));
}

function sfxTap() {
  if (!sfxEnabled) return;
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  playTone(880, ctx.currentTime, 0.05, "sine", 0.06);
}

function toggleSfx() {
  sfxEnabled = !sfxEnabled;
  saveAudioPref();
  if (sfxEnabled) sfxTap();
  return sfxEnabled;
}

/* garante que o AudioContext seja liberado no primeiro toque (política de autoplay) */
function initAudioOnFirstGesture() {
  const start = () => {
    ensureAudioCtx();
    document.removeEventListener("pointerdown", start);
  };
  document.addEventListener("pointerdown", start, { once: true });
}
initAudioOnFirstGesture();
