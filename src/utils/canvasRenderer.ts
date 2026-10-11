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

// Glitch random characters bank
const GLITCH_CHARS = '01#X%_>/$@!*&{}[]~';

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
  const progress = options.progressRatio ?? (visibleText.length / Math.max(1, settings.text.length));
  const isComplete = progress >= 0.99;
  const style = settings.animationStyle || 'typewriter';

  // 1. Fond sombre de base
  ctx.fillStyle = style === 'terminal' ? '#040507' : theme.bgFill;
  ctx.fillRect(0, 0, W, H);

  // 2. Halo lumineux radial ou Scanlines Terminal
  if (style === 'terminal') {
    // Subtle terminal window background box
    ctx.save();
    const padX = W * 0.06;
    const padY = H * 0.08;
    const boxW = W - padX * 2;
    const boxH = H - padY * 2;

    // Window frame
    ctx.fillStyle = '#090a0f';
    ctx.strokeStyle = '#1e202c';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(padX, padY, boxW, boxH, 16);
    ctx.fill();
    ctx.stroke();

    // Top titlebar
    ctx.fillStyle = '#12141c';
    ctx.beginPath();
    ctx.roundRect(padX, padY, boxW, 44, [16, 16, 0, 0]);
    ctx.fill();

    // Window buttons: Red, Yellow, Green
    const btnY = padY + 22;
    ctx.fillStyle = '#ff5f56';
    ctx.beginPath();
    ctx.arc(padX + 24, btnY, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffbd2e';
    ctx.beginPath();
    ctx.arc(padX + 44, btnY, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#27c93f';
    ctx.beginPath();
    ctx.arc(padX + 64, btnY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Window Title
    ctx.font = '12px "Space Mono", monospace';
    ctx.fillStyle = '#71768a';
    ctx.textAlign = 'center';
    ctx.fillText('bash — gandxo@studio: ~', W / 2, padY + 26);
    ctx.restore();
  } else if (settings.haloIntensity > 0) {
    let haloY = H * 0.35;
    if (settings.haloPosition === 'top') haloY = H * 0.22;
    if (settings.haloPosition === 'bottom') haloY = H * 0.7;

    const haloRadius = Math.max(W, H) * 0.55;
    const glow = ctx.createRadialGradient(W / 2, haloY, 20, W / 2, haloY, haloRadius);
    const alpha = (settings.haloIntensity / 100) * (style === 'glitch' ? 0.45 : 0.35);

    glow.addColorStop(0, theme.accentGlow.replace(/[\d.]+\)$/, `${alpha})`));
    glow.addColorStop(0.5, theme.accentGlow.replace(/[\d.]+\)$/, `${alpha * 0.4})`));
    glow.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
  }

  // 3. Scanlines / Grid pour Glitch et Terminal
  if (style === 'glitch' || style === 'terminal') {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
    for (let y = 0; y < H; y += 4) {
      ctx.fillRect(0, y, W, 1);
    }
    ctx.restore();
  }

  // 4. Film grain subtil si activé
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

  // 5. Header Tag (Kicker supérieur)
  if (settings.headerTag.trim() && style !== 'terminal') {
    ctx.save();
    ctx.font = `600 ${Math.max(16, Math.round(settings.fontSize * 0.36))}px "${settings.fontFamily}", sans-serif`;
    ctx.fillStyle = theme.taglineColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const tagY = H * 0.08;
    ctx.fillText(settings.headerTag.trim().toUpperCase(), W / 2, tagY);
    ctx.restore();
  }

  // 6. Text Formatting & Animation Style Calculations
  const fontToUse = style === 'terminal' ? 'Space Mono' : settings.fontFamily;
  const mainFont = `600 ${settings.fontSize}px "${fontToUse}", sans-serif`;
  const maxWidth = style === 'terminal' ? W * 0.76 : W * 0.84;

  let textToRender = visibleText;

  // GLITCH STYLE : Scramble active characters
  if (style === 'glitch' && !isComplete && visibleText.length > 0) {
    const chars = visibleText.split('');
    const lastIdx = chars.length - 1;
    if (Math.random() < 0.6) {
      chars[lastIdx] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
    }
    if (chars.length > 3 && Math.random() < 0.3) {
      const rIdx = Math.max(0, lastIdx - Math.floor(Math.random() * 3));
      chars[rIdx] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
    }
    textToRender = chars.join('');
  }

  // WORD BY WORD STYLE : Ensure clean word segmentation
  if (style === 'wordByWord') {
    const fullWords = settings.text.trim().split(/\s+/);
    const totalWords = Math.max(1, fullWords.length);
    const visibleWordCount = Math.max(0, Math.ceil(progress * totalWords));
    textToRender = fullWords.slice(0, visibleWordCount).join(' ');
  }

  // TERMINAL STYLE : Prefix with developer prompt
  const terminalPrompt = '$ ';
  if (style === 'terminal') {
    textToRender = terminalPrompt + textToRender;
  }

  const lines = wrapTextLines(ctx, textToRender, maxWidth, mainFont);
  const effectiveLines = lines.length === 0 ? [''] : lines;
  const lineHeight = settings.fontSize * settings.lineHeight;
  const totalHeight = effectiveLines.length * lineHeight;

  // Calcul du centrage vertical
  let startY = (H - totalHeight) / 2;
  if (style === 'terminal') {
    startY = H * 0.22; // Start from top area inside terminal box
  } else if (settings.footerSignature) {
    startY -= 20;
  }

  // ZOOM ANIMATION : Dynamic Scale & Camera Punch-In
  ctx.save();
  if (style === 'zoom') {
    // Zoom punch-in: scale expands dynamically and breathes smoothly
    const zoomScale = isComplete ? 1.0 : 1.08 - 0.08 * (progress % 0.15 / 0.15);
    ctx.translate(W / 2, H / 2);
    ctx.scale(zoomScale, zoomScale);
    ctx.translate(-W / 2, -H / 2);
  }

  // FADE ANIMATION : Smooth alpha interpolation
  if (style === 'fade') {
    const fadeAlpha = Math.min(1, 0.2 + progress * 1.2);
    ctx.globalAlpha = fadeAlpha;
  }

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
    if (settings.textAlign === 'left' || style === 'terminal') {
      x = (W - maxWidth) / 2;
    } else if (settings.textAlign === 'right') {
      x = W - (W - maxWidth) / 2 - lineWidth;
    }

    // GLITCH RGB Split Render
    if (style === 'glitch') {
      const glitchOffset = isComplete ? 0 : (Math.random() < 0.4 ? (Math.random() * 5 - 2.5) : 1);
      if (glitchOffset !== 0) {
        // Cyan offset channel
        ctx.fillStyle = 'rgba(0, 240, 255, 0.7)';
        ctx.fillText(line, x - glitchOffset * 2, currentY);

        // Magenta/Red offset channel
        ctx.fillStyle = 'rgba(255, 0, 70, 0.7)';
        ctx.fillText(line, x + glitchOffset * 2, currentY);
      }
    }

    // TERMINAL STYLE : Color prompt symbol
    if (style === 'terminal' && i === 0 && line.startsWith(terminalPrompt)) {
      // Draw prompt in green
      ctx.fillStyle = '#4ade80';
      ctx.fillText(terminalPrompt, x, currentY);
      const promptW = ctx.measureText(terminalPrompt).width;
      // Draw rest of text
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(line.slice(terminalPrompt.length), x + promptW, currentY);
    } else if (style === 'wordByWord' && i === effectiveLines.length - 1 && !isComplete) {
      // Word by word highlight on the newest word
      const wordsInLine = line.split(/\s+/);
      let runningX = x;
      for (let wIdx = 0; wIdx < wordsInLine.length; wIdx++) {
        const word = wordsInLine[wIdx];
        const isLatestWord = wIdx === wordsInLine.length - 1;
        const wordText = wIdx < wordsInLine.length - 1 ? word + ' ' : word;
        const wWidth = ctx.measureText(wordText).width;

        if (isLatestWord) {
          ctx.save();
          ctx.shadowColor = theme.textColor;
          ctx.shadowBlur = 16;
          ctx.fillStyle = '#ffffff';
          ctx.fillText(wordText, runningX, currentY);
          ctx.restore();
        } else {
          ctx.fillStyle = theme.textColor;
          ctx.fillText(wordText, runningX, currentY);
        }
        runningX += wWidth;
      }
    } else {
      // Standard / Fade / Zoom text render
      ctx.shadowColor = theme.textColor;
      ctx.shadowBlur = settings.haloIntensity > 40 ? 12 : 6;
      ctx.fillStyle = style === 'terminal' ? '#e2e8f0' : theme.textColor;
      ctx.fillText(line, x, currentY);
    }

    currentY += lineHeight;
  }
  ctx.restore();

  // 7. Curseur clignotant
  const isTyping = visibleText.length < settings.text.length;
  const showCursor = (options.showCursor ?? true) && (isTyping || (options.cursorBlink ?? true)) && settings.showCursor;

  if (showCursor && effectiveLines.length > 0) {
    const lastLineIdx = effectiveLines.length - 1;
    const lastLine = effectiveLines[lastLineIdx] || '';

    ctx.font = mainFont;
    const lastLineWidth = ctx.measureText(lastLine).width;

    let cursorX = (W + lastLineWidth) / 2 + 6;
    if (settings.textAlign === 'left' || style === 'terminal') {
      cursorX = (W - maxWidth) / 2 + lastLineWidth + 6;
    } else if (settings.textAlign === 'right') {
      cursorX = W - (W - maxWidth) / 2 + 6;
    }

    let cursorY = startY + lastLineIdx * lineHeight + (lineHeight - settings.fontSize) / 2;

    ctx.save();
    ctx.fillStyle = style === 'terminal' ? '#4ade80' : theme.cursorColor;
    ctx.shadowColor = style === 'terminal' ? '#4ade80' : theme.cursorColor;
    ctx.shadowBlur = 8;

    const effectiveCursorStyle = style === 'terminal' ? 'block' : settings.cursorStyle;

    if (effectiveCursorStyle === 'bar') {
      ctx.fillRect(cursorX, cursorY, 4, settings.fontSize);
    } else if (effectiveCursorStyle === 'block') {
      ctx.fillRect(cursorX, cursorY, settings.fontSize * 0.52, settings.fontSize);
    } else if (effectiveCursorStyle === 'underscore') {
      ctx.fillRect(cursorX, cursorY + settings.fontSize - 4, settings.fontSize * 0.52, 4);
    } else if (effectiveCursorStyle === 'glow') {
      ctx.beginPath();
      ctx.arc(cursorX + 6, cursorY + settings.fontSize / 2, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 8. Signature / Watermark Inférieur
  if (settings.footerSignature.trim() && style !== 'terminal') {
    ctx.save();
    ctx.font = `600 ${Math.max(16, Math.round(settings.fontSize * 0.34))}px "${settings.fontFamily}", sans-serif`;
    ctx.fillStyle = theme.taglineColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    const sigY = H - (H * 0.07);
    ctx.fillText(settings.footerSignature.trim().toUpperCase(), W / 2, sigY);
    ctx.restore();
  } else if (style === 'terminal') {
    // Terminal footer status
    ctx.save();
    ctx.font = '11px "Space Mono", monospace';
    ctx.fillStyle = '#475569';
    ctx.textAlign = 'center';
    ctx.fillText('TERMINAL STUDIO  ·  CODE COMPILED SUCCESSFULLY', W / 2, H - H * 0.1);
    ctx.restore();
  }

  // 9. Safe Guides TikTok / Reels si activés
  if (settings.safeGuidesVisible && settings.aspectRatio === '9:16') {
    ctx.save();
    ctx.strokeStyle = 'rgba(232, 201, 141, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);

    ctx.strokeRect(40, 110, W - 80, 1);
    ctx.font = '12px sans-serif';
    ctx.fillStyle = 'rgba(232, 201, 141, 0.5)';
    ctx.fillText('ZONE SÉCURISÉE HAUT (TikTok / Reels)', 50, 100);

    ctx.strokeRect(40, H - 240, W - 80, 1);
    ctx.fillText('ZONE BASSE LÉGENDE & BOUTONS', 50, H - 250);

    ctx.strokeRect(W - 100, 120, 1, H - 380);
    ctx.restore();
  }
}
