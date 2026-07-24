/* ============================================================
   effects.js — Efeitos visuais de "jogo de verdade"
   Confete, sparkles, combo e tela de level-up. Tudo vanilla
   JS/CSS, sem bibliotecas externas.
   ============================================================ */

const CONFETTI_COLORS = ["#22d3c5", "#34d399", "#ffc93c", "#38bdf8", "#eef8f7"];

function fireConfetti(count = 36, durationMs = 1500) {
  const container = document.createElement("div");
  container.className = "confetti-layer";
  document.body.appendChild(container);
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "confetti-piece";
    const left = Math.random() * 100;
    const size = 6 + Math.random() * 6;
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const duration = durationMs * (0.7 + Math.random() * 0.6);
    const delay = Math.random() * 200;
    const rotate = Math.random() * 360;
    const drift = (Math.random() * 2 - 1) * 90;
    p.style.cssText =
      `left:${left}%; width:${size}px; height:${size * 0.4}px; background:${color}; ` +
      `animation-duration:${duration}ms; animation-delay:${delay}ms; --drift:${drift}px; --rot:${rotate}deg;`;
    container.appendChild(p);
  }
  setTimeout(() => container.remove(), durationMs + 400);
}

function sparkleBurst(x, y, count = 8) {
  for (let i = 0; i < count; i++) {
    const s = document.createElement("div");
    s.className = "sparkle-piece";
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const dist = 28 + Math.random() * 26;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    s.style.cssText = `left:${x}px; top:${y}px; background:${color}; --dx:${dx}px; --dy:${dy}px;`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 650);
  }
}

/* dispara sparkles a partir do centro de um elemento clicado */
function sparkleFromElement(el) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  sparkleBurst(r.left + r.width / 2, r.top + r.height / 2);
}

function showLevelUpOverlay(level) {
  const el = document.createElement("div");
  el.className = "levelup-overlay";
  el.innerHTML = `<div class="levelup-badge">⭐</div><div class="levelup-text">NÍVEL ${level}</div>`;
  document.body.appendChild(el);
  fireConfetti(55, 1700);
  requestAnimationFrame(() => el.classList.add("is-visible"));
  setTimeout(() => {
    el.classList.remove("is-visible");
    setTimeout(() => el.remove(), 400);
  }, 1600);
}

/* ---------------- combo (acertos consecutivos) ---------------- */
function updateComboBadge(combo) {
  const badge = document.getElementById("runner-combo");
  if (!badge) return;
  if (combo >= 2) {
    badge.textContent = `🔥 Combo x${combo}`;
    badge.classList.remove("hidden");
    badge.classList.remove("combo-pop");
    void badge.offsetWidth; // força reinício da animação
    badge.classList.add("combo-pop");
  } else {
    badge.classList.add("hidden");
  }
}
