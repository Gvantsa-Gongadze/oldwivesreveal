import { useState } from 'react';
import type { Reveal, RevealResult } from '@oldwivesreveal/shared-types';
import { BASE_URL } from '../api/reveals';

interface ShareButtonProps {
  reveal: Reveal;
}

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

async function drawShareCard(reveal: Reveal): Promise<Blob> {
  // Make sure the web fonts are actually decoded before Canvas reads them,
  // otherwise it silently falls back to the generic family.
  await Promise.all([
    document.fonts.load('600 230px Fraunces'),
    document.fonts.load('600 30px "IBM Plex Mono"'),
    document.fonts.load('32px "IBM Plex Mono"'),
    document.fonts.ready,
  ]).catch(() => undefined);

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

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
  ctx.font = '600 26px "IBM Plex Mono", monospace';
  ctx.fillText("AN OLD WIVES' METHOD", 540, 200);

  ctx.fillStyle = RESULT_COLORS[reveal.result];
  ctx.font = '600 260px Fraunces, Georgia, serif';
  ctx.fillText(reveal.result, 540, 560);

  ctx.fillStyle = 'rgba(246, 236, 235, 0.85)';
  ctx.font = '32px "IBM Plex Mono", monospace';
  ctx.fillText(RESULT_TAGLINE[reveal.result], 540, 660);

  ctx.strokeStyle = 'rgba(242, 207, 74, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(440, 780);
  ctx.lineTo(640, 780);
  ctx.stroke();

  ctx.fillStyle = '#f2cf4a';
  ctx.font = '600 28px "IBM Plex Mono", monospace';
  ctx.fillText("OLD WIVES' REVEAL", 540, 930);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Could not generate image'));
    }, 'image/png');
  });
}

type Status = 'idle' | 'sharing' | 'copied' | 'downloaded' | 'error';

const LABELS: Record<Status, string> = {
  idle: 'Share this reading',
  sharing: 'Preparing…',
  copied: 'Saved image + copied link',
  downloaded: 'Image saved',
  error: 'Could not share',
};

export function ShareButton({ reveal }: ShareButtonProps) {
  const [status, setStatus] = useState<Status>('idle');

  async function handleShare() {
    setStatus('sharing');
    try {
      const blob = await drawShareCard(reveal);
      const shareText = `It's a ${reveal.result}! (according to Old Wives' Reveal)`;
      // Points at the server-rendered preview page (not the SPA route directly)
      // so a pasted/posted link shows a rich Open Graph card on platforms that
      // don't accept an attached file - it redirects real visitors into the app.
      const shareUrl = `${BASE_URL}/${reveal.id}/share`;
      const nav = navigator as Navigator & {
        canShare?: (data?: ShareData) => boolean;
        share?: (data?: ShareData) => Promise<void>;
      };

      const file = new File([blob], 'old-wives-reveal.png', { type: 'image/png' });

      if (nav.canShare?.({ files: [file] })) {
        await nav.share!({ files: [file], title: "Old Wives' Reveal", text: shareText });
        setStatus('idle');
        return;
      }

      if (nav.share) {
        await nav.share({ title: "Old Wives' Reveal", text: shareText, url: shareUrl });
        setStatus('idle');
        return;
      }

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = 'old-wives-reveal.png';
      link.click();
      URL.revokeObjectURL(objectUrl);

      let copied = false;
      try {
        await navigator.clipboard?.writeText(`${shareText} ${shareUrl}`);
        copied = true;
      } catch {
        // Clipboard API unavailable (e.g. non-secure context) — the image still downloaded.
      }

      setStatus(copied ? 'copied' : 'downloaded');
      setTimeout(() => setStatus('idle'), 2500);
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        setStatus('idle');
        return;
      }
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2500);
    }
  }

  return (
    <button type="button" className="share-button" onClick={handleShare} disabled={status === 'sharing'}>
      {LABELS[status]}
    </button>
  );
}
