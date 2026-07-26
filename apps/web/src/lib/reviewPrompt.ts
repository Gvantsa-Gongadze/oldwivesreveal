import { Capacitor } from '@capacitor/core';
import { InAppReview } from '@capacitor-community/in-app-review';

const COUNT_KEY = 'owr-reveal-count';
const ASKED_KEY = 'owr-review-asked';
const ASK_AT_COUNT = 2;

/**
 * Ask for an App Store review after a good moment (a successful reveal),
 * but not on someone's very first one, and only ever once - Apple throttles
 * how often the system prompt actually shows regardless, but there's no
 * reason to keep calling it every time.
 */
export async function maybeRequestReview(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  if (localStorage.getItem(ASKED_KEY) === '1') {
    return;
  }

  const count = Number(localStorage.getItem(COUNT_KEY) ?? '0') + 1;
  localStorage.setItem(COUNT_KEY, String(count));

  if (count < ASK_AT_COUNT) {
    return;
  }

  localStorage.setItem(ASKED_KEY, '1');
  try {
    await InAppReview.requestReview();
  } catch {
    // Unavailable on this platform/OS version - safe to ignore.
  }
}
