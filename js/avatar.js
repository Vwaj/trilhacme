/* ============================================================
   avatar.js — Enfermeira-avatar SVG reativa
   Desenhada em código (SVG inline), sem imagens externas.
   Reage às respostas: neutra, feliz (acerto), pensativa,
   e "erro" (levemente desapontada, mas gentil).
   ============================================================ */

const AVATAR_SKIN = "#f1c9a5";
const AVATAR_HAIR = "#5b3a29";
const AVATAR_SCRUBS = "#22d3c5";
const AVATAR_SCRUBS_DK = "#149d92";
const AVATAR_CAP = "#eef8f7";

/* expressões: 'idle' | 'happy' | 'think' | 'sad' */
function nurseSVG(expr = "idle") {
  // olhos e boca variam conforme a expressão
  let eyes, mouth, brow = "";
  switch (expr) {
    case "happy":
      eyes = `<path d="M78 96 q7 -8 14 0" stroke="#3a2a20" stroke-width="3.5" fill="none" stroke-linecap="round"/>
              <path d="M108 96 q7 -8 14 0" stroke="#3a2a20" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
      mouth = `<path d="M88 118 q12 14 24 0" stroke="#b5442f" stroke-width="4" fill="#e98974" stroke-linecap="round"/>`;
      break;
    case "think":
      eyes = `<circle cx="85" cy="97" r="4.2" fill="#3a2a20"/><circle cx="115" cy="95" r="4.2" fill="#3a2a20"/>`;
      brow = `<path d="M104 84 q9 -3 16 1" stroke="#4a3428" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      mouth = `<path d="M90 120 q10 -4 20 -1" stroke="#b5442f" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      break;
    case "sad":
      eyes = `<path d="M80 99 q6 -6 13 -2" stroke="#3a2a20" stroke-width="3.5" fill="none" stroke-linecap="round"/>
              <path d="M108 97 q6 -4 13 2" stroke="#3a2a20" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
      mouth = `<path d="M90 122 q11 -9 22 -1" stroke="#b5442f" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      break;
    default: // idle
      eyes = `<circle cx="86" cy="96" r="4.5" fill="#3a2a20"/><circle cx="114" cy="96" r="4.5" fill="#3a2a20"/>`;
      mouth = `<path d="M90 118 q10 6 20 0" stroke="#b5442f" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  }

  return `
<svg viewBox="0 0 200 220" class="nurse-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <!-- ombros / uniforme -->
  <path d="M40 220 q0 -55 60 -55 q60 0 60 55 Z" fill="${AVATAR_SCRUBS}"/>
  <path d="M40 220 q0 -55 60 -55 q10 0 18 3 l0 52 Z" fill="${AVATAR_SCRUBS_DK}" opacity="0.25"/>
  <!-- gola em V -->
  <path d="M84 168 l16 20 l16 -20 q-16 -6 -32 0 Z" fill="${AVATAR_SCRUBS_DK}"/>
  <!-- broche / crachá -->
  <rect x="128" y="182" width="14" height="18" rx="2" fill="#eef8f7" stroke="${AVATAR_SCRUBS_DK}" stroke-width="1.5"/>
  <!-- pescoço -->
  <rect x="90" y="150" width="20" height="24" rx="8" fill="${AVATAR_SKIN}"/>
  <!-- cabelo (atrás) -->
  <path d="M62 96 q0 -54 38 -54 q38 0 38 54 q0 20 -6 30 l-64 0 q-6 -10 -6 -30 Z" fill="${AVATAR_HAIR}"/>
  <!-- rosto -->
  <path d="M68 98 q0 44 32 44 q32 0 32 -44 q0 -34 -32 -34 q-32 0 -32 34 Z" fill="${AVATAR_SKIN}"/>
  <!-- franja -->
  <path d="M68 92 q4 -30 32 -30 q28 0 32 30 q-14 -14 -32 -14 q-18 0 -32 14 Z" fill="${AVATAR_HAIR}"/>
  <!-- touca de enfermeira -->
  <path d="M66 74 q34 -20 68 0 l0 -8 q-34 -18 -68 0 Z" fill="${AVATAR_CAP}" stroke="${AVATAR_SCRUBS_DK}" stroke-width="1.5"/>
  <!-- cruz na touca -->
  <g fill="${AVATAR_SCRUBS}"><rect x="96" y="60" width="8" height="3"/><rect x="98.5" y="57.5" width="3" height="8"/></g>
  <!-- bochechas -->
  <circle cx="76" cy="112" r="6" fill="#f0a996" opacity="0.5"/>
  <circle cx="124" cy="112" r="6" fill="#f0a996" opacity="0.5"/>
  ${brow}
  ${eyes}
  ${mouth}
</svg>`;
}

let avatarResetTimer = null;

/* atualiza a expressão do avatar no cabeçalho da pergunta */
function setNurseExpression(expr, autoResetMs = 0) {
  const holder = document.getElementById("nurse-avatar");
  if (!holder) return;
  holder.innerHTML = nurseSVG(expr);
  holder.classList.remove("nurse-pop");
  void holder.offsetWidth;
  holder.classList.add("nurse-pop");
  if (avatarResetTimer) clearTimeout(avatarResetTimer);
  if (autoResetMs > 0) {
    avatarResetTimer = setTimeout(() => setNurseExpression("idle"), autoResetMs);
  }
}
