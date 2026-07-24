/* ============================================================
   sounds.js — Trilha sonora e efeitos sonoros sintetizados
   Tudo gerado por código via Web Audio API — sem arquivos de
   áudio externos, sem dependências, sem risco de direito autoral.
   Música e efeitos agora são controlados por botões separados.
   ============================================================ */

let audioCtx = null;
let musicEnabled = true;
let sfxEnabled = true;
let musicPlaying = false;
let musicTimer = null;
let musicStep = 0;
let noiseBuffer = null;

const AUDIO_PREF_KEY = "estudapp_audio_v2";

function loadAudioPref() {
  try {
    const raw = localStorage.getItem(AUDIO_PREF_KEY);
    if (raw !== null) {
      const p = JSON.parse(raw);
      musicEnabled = p.musicEnabled !== undefined ? p.musicEnabled : true;
      sfxEnabled = p.sfxEnabled !== undefined ? p.sfxEnabled : true;
    }
  } catch (e) { /* mantém padrão */ }
}
function saveAudioPref() {
  try { localStorage.setItem(AUDIO_PREF_KEY, JSON.stringify({ musicEnabled, sfxEnabled })); } catch (e) {}
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

function getNoiseBuffer(ctx) {
  if (noiseBuffer) return noiseBuffer;
  const len = ctx.sampleRate * 1; // 1 segundo de ruído branco, reaproveitado
  noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return noiseBuffer;
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

/* ---------------- efeitos sonoros (botão separado) ---------------- */
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

/* ---------------- trilha de fundo: kick + hi-hat + baixo + arpejo ---------------- */
/* Progressão animada de 4 acordes (C · G · Am · F), 132 BPM, grade de colcheias. */
const CHORDS = [
  { bass: 130.81, notes: [261.63, 329.63, 392.0] }, // C
  { bass: 98.0, notes: [196.0, 246.94, 293.66] },   // G
  { bass: 110.0, notes: [220.0, 261.63, 329.63] },  // Am
  { bass: 87.31, notes: [174.61, 220.0, 261.63] },  // F
];
const EIGHTH = 60 / 132 / 2; // duração de uma colcheia a 132 BPM
let arpCursor = 0;

function playKick(startTime) {
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(150, startTime);
  osc.frequency.exponentialRampToValueAtTime(42, startTime + 0.11);
  g.gain.setValueAtTime(0.22, startTime);
  g.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.16);
  osc.connect(g).connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + 0.18);
}

function playHihat(startTime, accent) {
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  const src = ctx.createBufferSource();
  src.buffer = getNoiseBuffer(ctx);
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 7000;
  const g = ctx.createGain();
  g.gain.setValueAtTime(accent ? 0.05 : 0.03, startTime);
  g.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.045);
  src.connect(hp).connect(g).connect(ctx.destination);
  src.start(startTime);
  src.stop(startTime + 0.05);
}

function scheduleMusicStep() {
  if (!musicPlaying) return;
  const ctx = ensureAudioCtx();
  if (ctx) {
    const t = ctx.currentTime;
    const barIndex = Math.floor(musicStep / 8);
    const chord = CHORDS[barIndex % CHORDS.length];
    const stepInBar = musicStep % 8;

    playHihat(t, stepInBar % 2 === 0);
    if (stepInBar % 2 === 0) playKick(t);
    if (stepInBar === 0 || stepInBar === 4) {
      playTone(chord.bass, t, EIGHTH * 1.8, "square", 0.09);
    }
    if (stepInBar % 2 === 1) {
      const note = chord.notes[arpCursor % chord.notes.length];
      arpCursor++;
      playTone(note, t, EIGHTH * 0.85, "triangle", 0.055);
    }
  }
  musicStep = (musicStep + 1) % (8 * CHORDS.length);
  musicTimer = setTimeout(scheduleMusicStep, EIGHTH * 1000);
}

function startMusic() {
  if (musicPlaying || !musicEnabled) return;
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  musicPlaying = true;
  musicStep = 0;
  arpCursor = 0;
  scheduleMusicStep();
}

function stopMusic() {
  musicPlaying = false;
  clearTimeout(musicTimer);
}

function toggleMusic() {
  musicEnabled = !musicEnabled;
  saveAudioPref();
  if (musicEnabled) startMusic();
  else stopMusic();
  return musicEnabled;
}

function toggleSfx() {
  sfxEnabled = !sfxEnabled;
  saveAudioPref();
  if (sfxEnabled) sfxTap();
  return sfxEnabled;
}

/* inicia áudio no primeiro toque do usuário (política de autoplay dos navegadores) */
function initAudioOnFirstGesture() {
  const start = () => {
    ensureAudioCtx();
    if (musicEnabled) startMusic();
    document.removeEventListener("pointerdown", start);
  };
  document.addEventListener("pointerdown", start, { once: true });
}
initAudioOnFirstGesture();

/* pausa a música quando o app vai pra segundo plano (economiza bateria) */
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopMusic();
  else if (musicEnabled) startMusic();
});
