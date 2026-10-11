import { StudioSettings, AspectRatioOption } from '../types';
import { COLOR_THEMES } from '../data/copywritingBank';

export const ASPECT_RATIOS: AspectRatioOption[] = [
  { id: '9:16', label: '9:16', sub: 'TikTok · Reels · WhatsApp', width: 720, height: 1280 },
  { id: '1:1', label: '1:1', sub: 'Carré · Feed Instagram', width: 1080, height: 1080 },
  { id: '4:5', label: '4:5', sub: 'Portrait · Feed Pro', width: 1080, height: 1350 },
  { id: '16:9', label: '16:9', sub: 'Paysage · YouTube & Web', width: 1280, height: 720 },
];

export function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  font: string
): string[] {
  ctx.font = font;
  const rawParagraphs = text.split('\n');
  const allLines: string[] = [];

  for (const para of rawParagraphs) {
    if (para.trim() === '') {
      allLines.push('');
      continue;
    }

    const words = para.split(/\s+/);
    let line = '';

    for (const word of words) {
      const test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        allLines.push(line);
        line = word;
      } else {
        line = test;
      }
    }

    if (line) {
      allLines.push(line);
    }
  }

  return allLines;
}

export function drawStudioFrame(
  canvas: HTMLCanvasElement,
  visibleText: string,
  settings: StudioSettings,
  options: {
    showCursor?: boolean;
    cursorBlink?: boolean;
    highlightLastWord?: boolean;
    progressRatio?: number;
  } = {}
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;
  const theme = COLOR_THEMES.find(t => t.id === settings.themeId) || COLOR_THEMES[0];

  // 1. Fond sombre de base
  ctx.fillStyle = theme.bgFill;
  ctx.fillRect(0, 0, W, H);

  // 2. Halo lumineux radial (ambiance cinématographique)
  if (settings.haloIntensity > 0) {
    let haloY = H * 0.35;
    if (settings.haloPosition === 'top') haloY = H * 0.22;
    if (settings.haloPosition === 'bottom') haloY = H * 0.7;

    const haloRadius = Math.max(W, H) * 0.55;
    const glow = ctx.createRadialGradient(W / 2, haloY, 20, W / 2, haloY, haloRadius);
    const alpha = (settings.haloIntensity / 100) * 0.35;

    glow.addColorStop(0, theme.accentGlow.replace(/[\d.]+\)$/, `${alpha})`));
    glow.addColorStop(0.5, theme.accentGlow.replace(/[\d.]+\)$/, `${alpha * 0.4})`));
    glow.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
  }

  // 3. Film grain subtil si activé
  if (settings.filmGrain) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
    for (let i = 0; i < 400; i++) {
      const gx = Math.random() * W;
      const gy = Math.random() * H;
      ctx.fillRect(gx, gy, 1.5, 1.5);
    }
    ctx.restore();
  }

  // 4. Header Tag (Kicker supérieur)
  if (settings.headerTag.trim()) {
    ctx.save();
    ctx.font = `600 ${Math.max(16, Math.round(settings.fontSize * 0.36))}px "${settings.fontFamily}", sans-serif`;
    ctx.fillStyle = theme.taglineColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const tagY = H * 0.08;
    ctx.fillText(settings.headerTag.trim().toUpperCase(), W / 2, tagY);
    ctx.restore();
  }

  // 5. Texte Principal Typographique
  const mainFont = `600 ${settings.fontSize}px "${settings.fontFamily}", sans-serif`;
  const maxWidth = W * 0.84;
  const lines = wrapTextLines(ctx, visibleText, maxWidth, mainFont);
  const effectiveLines = lines.length === 0 ? [''] : lines;
  const lineHeight = settings.fontSize * settings.lineHeight;
  const totalHeight = effectiveLines.length * lineHeight;

  // Calcul du point de départ vertical (centré avec compensation optique)
  let startY = (H - totalHeight) / 2;
  // Décalage léger vers le haut si un footer existe
  if (settings.footerSignature) {
    startY -= 20;
  }

  ctx.save();
  ctx.font = mainFont;
  ctx.textBaseline = 'top';

  let currentY = startY;

  for (let i = 0; i < effectiveLines.length; i++) {
    const line = effectiveLines[i];
    if (!line) {
      currentY += lineHeight;
      continue;
    }

    const lineWidth = ctx.measureText(line).width;
    let x = (W - lineWidth) / 2;
    if (settings.textAlign === 'left') {
      x = (W - maxWidth) / 2;
    } else if (settings.textAlign === 'right') {
      x = W - (W - maxWidth) / 2 - lineWidth;
    }

    // Lueur textuelle soignée
    ctx.shadowColor = theme.textColor;
    ctx.shadowBlur = settings.haloIntensity > 40 ? 12 : 6;
    ctx.fillStyle = theme.textColor;
    ctx.fillText(line, x, currentY);

    currentY += lineHeight;
  }
  ctx.restore();

  // 6. Curseur clignotant
  const isTyping = visibleText.length < settings.text.length;
  const showCursor = (options.showCursor ?? true) && (isTyping || (options.cursorBlink ?? true)) && settings.showCursor;

  if (showCursor && effectiveLines.length > 0) {
    const lastLineIdx = effectiveLines.length - 1;
    const lastLine = effectiveLines[lastLineIdx] || '';

    ctx.font = mainFont;
    const lastLineWidth = ctx.measureText(lastLine).width;

    let cursorX = (W + lastLineWidth) / 2 + 6;
    if (settings.textAlign === 'left') {
      cursorX = (W - maxWidth) / 2 + lastLineWidth + 6;
    } else if (settings.textAlign === 'right') {
      cursorX = W - (W - maxWidth) / 2 + 6;
    }

    const cursorY = startY + lastLineIdx * lineHeight + (lineHeight - settings.fontSize) / 2;

    ctx.save();
    ctx.fillStyle = theme.cursorColor;
    ctx.shadowColor = theme.cursorColor;
    ctx.shadowBlur = 8;

    if (settings.cursorStyle === 'bar') {
      ctx.fillRect(cursorX, cursorY, 4, settings.fontSize);
    } else if (settings.cursorStyle === 'block') {
      ctx.fillRect(cursorX, cursorY, settings.fontSize * 0.5, settings.fontSize);
    } else if (settings.cursorStyle === 'underscore') {
      ctx.fillRect(cursorX, cursorY + settings.fontSize - 4, settings.fontSize * 0.5, 4);
    } else if (settings.cursorStyle === 'glow') {
      ctx.beginPath();
      ctx.arc(cursorX + 6, cursorY + settings.fontSize / 2, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 7. Signature / Watermark Inférieur
  if (settings.footerSignature.trim()) {
    ctx.save();
    ctx.font = `600 ${Math.max(16, Math.round(settings.fontSize * 0.34))}px "${settings.fontFamily}", sans-serif`;
    ctx.fillStyle = theme.taglineColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    const sigY = H - (H * 0.07);
    ctx.fillText(settings.footerSignature.trim().toUpperCase(), W / 2, sigY);
    ctx.restore();
  }

  // 8. Safe Guides TikTok / Reels si activés (Overlay de cadrage pro)
  if (settings.safeGuidesVisible && settings.aspectRatio === '9:16') {
    ctx.save();
    ctx.strokeStyle = 'rgba(232, 201, 141, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);

    // Top header zone (TikTok top bar)
    ctx.strokeRect(40, 110, W - 80, 1);
    ctx.font = '12px sans-serif';
    ctx.fillStyle = 'rgba(232, 201, 141, 0.5)';
    ctx.fillText('ZONE SÉCURISÉE HAUT (TikTok / Reels)', 50, 100);

    // Bottom caption zone
    ctx.strokeRect(40, H - 240, W - 80, 1);
    ctx.fillText('ZONE BASSE LÉGENDE & BOUTONS', 50, H - 250);

    // Right action buttons safe boundary
    ctx.strokeRect(W - 100, 120, 1, H - 380);
    ctx.restore();
  }
}
