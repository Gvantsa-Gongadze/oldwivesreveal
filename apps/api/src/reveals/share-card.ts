import { createCanvas } from '@napi-rs/canvas';
import type { Reveal, RevealResult } from '@oldwivesreveal/shared-types';

const RESULT_COLORS: Record<RevealResult, string> = {
  BOY: '#8d9baa',
  GIRL: '#efa294',
  TIE: '#e8637c',
};

const RESULT_TAGLINE: Record<RevealResult, string> = {
  BOY: "Father's cycle runs freshest",
  GIRL: "Mother's cycle runs freshest",
  TIE: 'Both renew together',
};

/**
 * Server-side twin of apps/web/src/components/ShareButton.tsx's Canvas card,
 * so social crawlers (which never run our JS) get the same image via the
 * og:image on the /reveals/:id/share page. Uses system-safe font families
 * instead of the app's webfonts, since bundling/registering those here isn't
 * worth the risk for a background preview image.
 */
export function renderShareCard(reveal: Reveal): Buffer {
  const canvas = createCanvas(1080, 1080);
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(540, 420, 120, 540, 540, 900);
  gradient.addColorStop(0, '#3d92ac');
  gradient.addColorStop(1, '#1c4753');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1080);

  ctx.strokeStyle = 'rgba(246, 236, 235, 0.25)';
  ctx.lineWidth = 2;
  ctx.strokeRect(48, 48, 984, 984);

  ctx.textAlign = 'center';

  ctx.fillStyle = '#ddc9c8';
  ctx.font = '600 26px monospace';
  ctx.fillText("AN OLD WIVES' METHOD", 540, 200);

  ctx.fillStyle = RESULT_COLORS[reveal.result];
  ctx.font = '600 260px Georgia, serif';
  ctx.fillText(reveal.result, 540, 560);

  ctx.fillStyle = 'rgba(246, 236, 235, 0.85)';
  ctx.font = '32px monospace';
  ctx.fillText(RESULT_TAGLINE[reveal.result], 540, 660);

  ctx.strokeStyle = 'rgba(242, 207, 74, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(440, 780);
  ctx.lineTo(640, 780);
  ctx.stroke();

  ctx.fillStyle = '#f2cf4a';
  ctx.font = '600 28px monospace';
  ctx.fillText("OLD WIVES' REVEAL", 540, 930);

  return canvas.toBuffer('image/png');
}
