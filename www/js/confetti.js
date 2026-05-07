// Lightweight confetti canvas — triggered on great verdicts. No dependency.

import { prefersReducedMotion } from "./a11y.js";

export function fireConfetti({ count = 80, durationMs = 2200 } = {}) {
  if (typeof document === "undefined") return;
  if (prefersReducedMotion()) return;
  const canvas = document.createElement("canvas");
  canvas.className = "confetti-canvas";
  const w = window.innerWidth, h = window.innerHeight;
  canvas.width = w; canvas.height = h;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  const colors = ["#c9a961", "#e0c47a", "#7d1f2e", "#a02b3d", "#f0d68f", "#ffffff"];
  const pieces = [];
  for (let i = 0; i < count; i++) {
    pieces.push({
      x: w / 2 + (Math.random() - 0.5) * 80,
      y: h / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: -Math.random() * 14 - 4,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.4,
      size: 6 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      gravity: 0.35,
    });
  }

  const start = performance.now();
  function tick(now) {
    const t = (now - start) / durationMs;
    if (t >= 1) { canvas.remove(); return; }
    ctx.clearRect(0, 0, w, h);
    pieces.forEach(p => {
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - t);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.4);
      ctx.restore();
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
