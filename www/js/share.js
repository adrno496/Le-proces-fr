// Share verdict as a generated image (Canvas → blob → Web Share API or download).

function loadLogo() {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = "icons/logo.png";
  });
}

export async function generateVerdictCard(caseData, verdict, profile) {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");

  // Background gradient
  const grad = ctx.createRadialGradient(540, 380, 80, 540, 540, 700);
  grad.addColorStop(0, "#5a1422");
  grad.addColorStop(0.6, "#2a0c12");
  grad.addColorStop(1, "#100407");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1080);

  // Logo watermark behind everything (low opacity)
  const logo = await loadLogo();
  if (logo) {
    ctx.save();
    ctx.globalAlpha = 0.10;
    const size = 760;
    ctx.drawImage(logo, (1080 - size) / 2, (1080 - size) / 2, size, size);
    ctx.restore();
  }

  // Decorative golden borders
  ctx.strokeStyle = "#c9a961";
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, 1000, 1000);
  ctx.lineWidth = 1;
  ctx.strokeRect(64, 64, 952, 952);

  // Title "LE PROCÈS"
  ctx.fillStyle = "#c9a961";
  ctx.font = "italic 700 56px 'Newsreader', Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("LE PROCÈS", 540, 140);
  ctx.font = "20px 'Geist', sans-serif";
  ctx.fillStyle = "#8c7239";
  ctx.fillText("⚜  TRIBUNAL  ⚜", 540, 175);

  // Date + dossier
  ctx.fillStyle = "#b59f7b";
  ctx.font = "20px 'JetBrains Mono', monospace";
  ctx.fillText(`DOSSIER N° ${caseData.caseNumber || ""}  ·  ${caseData.date || ""}`, 540, 230);

  // Case title
  ctx.fillStyle = "#f0e6d2";
  ctx.font = "italic 38px 'Newsreader', Georgia, serif";
  wrapText(ctx, caseData.title, 540, 310, 880, 50);

  // Stamp
  const isGuilty = verdict.verdict === "guilty";
  ctx.save();
  ctx.translate(540, 580);
  ctx.rotate(-0.05);
  const stampColor = isGuilty ? "#a8392e" : "#4a7a41";
  ctx.strokeStyle = stampColor;
  ctx.fillStyle = stampColor;
  ctx.lineWidth = 6;
  ctx.strokeRect(-280, -90, 560, 180);
  ctx.lineWidth = 2;
  ctx.strokeRect(-265, -75, 530, 150);
  ctx.font = "700 80px 'Newsreader', serif";
  ctx.textAlign = "center";
  ctx.fillText(isGuilty ? "✗ COUPABLE" : "✓ NON-COUPABLE", 0, 30);
  ctx.restore();

  // Severity dots
  const dots = "●".repeat(verdict.severity || 0) + "○".repeat(5 - (verdict.severity || 0));
  ctx.fillStyle = "#c9a961";
  ctx.font = "36px 'Geist', sans-serif";
  ctx.fillText(`SÉVÉRITÉ ${dots}`, 540, 760);

  // Author footer
  ctx.fillStyle = "#b59f7b";
  ctx.font = "italic 28px 'Newsreader', serif";
  ctx.fillText(`— Maître ${profile.username || "Votre Honneur"}`, 540, 870);

  // Stats footer
  ctx.fillStyle = "#8b7355";
  ctx.font = "20px 'JetBrains Mono', monospace";
  ctx.fillText(`${profile.totalVerdicts || 0} verdicts · streak ${profile.streak || 0} 🔥`, 540, 920);

  // Watermark
  ctx.fillStyle = "rgba(201,169,97,0.6)";
  ctx.font = "16px 'Geist', sans-serif";
  ctx.fillText("leproces.app", 540, 1010);

  return new Promise(resolve => canvas.toBlob(b => resolve(b), "image/png"));
}

function wrapText(ctx, text, cx, y, maxWidth, lineHeight) {
  const words = String(text).split(/\s+/);
  let line = "";
  const lines = [];
  for (const w of words) {
    const test = line + w + " ";
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line.trim()); line = w + " ";
    } else { line = test; }
  }
  if (line.trim()) lines.push(line.trim());
  const totalH = lines.length * lineHeight;
  let yy = y - (totalH / 2) + lineHeight / 2;
  for (const l of lines) { ctx.fillText(l, cx, yy); yy += lineHeight; }
}

export async function shareVerdict(caseData, verdict, profile) {
  const blob = await generateVerdictCard(caseData, verdict, profile);
  if (!blob) return false;
  const file = new File([blob], "verdict.png", { type: "image/png" });
  const data = { files: [file], title: "Mon verdict — Le Procès", text: `Ma sentence dans l'affaire « ${caseData.title} ».` };
  if (navigator.canShare && navigator.canShare(data)) {
    try { await navigator.share(data); return true; } catch { /* user cancelled */ }
  }
  // Fallback: download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "verdict.png"; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}
