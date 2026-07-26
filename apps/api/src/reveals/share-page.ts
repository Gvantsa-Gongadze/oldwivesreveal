import type { Reveal } from '@oldwivesreveal/shared-types';

const RESULT_TITLE: Record<Reveal['result'], string> = {
  BOY: "It's a BOY!",
  GIRL: "It's a GIRL!",
  TIE: "It's a coin flip!",
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

/**
 * A crawler-friendly landing page for a shared reveal: static Open Graph /
 * Twitter Card tags (so Facebook, Twitter/X, iMessage, Slack etc. render a
 * rich preview when the link is pasted or posted) plus a redirect for real
 * visitors into the actual SPA. Social crawlers don't run JS and generally
 * ignore meta-refresh, so they just read the tags below; humans get bounced
 * straight through.
 */
export function renderSharePage(reveal: Reveal, webOrigin: string): string {
  const title = `${RESULT_TITLE[reveal.result]} — Old Wives' Reveal`;
  const description = "An old wives' method for guessing boy or girl.";
  const imageUrl = `${webOrigin}/api/reveals/${reveal.id}/card.png`;
  const pageUrl = `${webOrigin}/api/reveals/${reveal.id}/share`;
  const appUrl = `${webOrigin}/reveal/${reveal.id}`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)}</title>
<meta property="og:type" content="website" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:image" content="${escapeHtml(imageUrl)}" />
<meta property="og:image:width" content="1080" />
<meta property="og:image:height" content="1080" />
<meta property="og:url" content="${escapeHtml(pageUrl)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
<meta http-equiv="refresh" content="0; url=${escapeHtml(appUrl)}" />
</head>
<body>
<p><a href="${escapeHtml(appUrl)}">View the full reading →</a></p>
</body>
</html>`;
}
