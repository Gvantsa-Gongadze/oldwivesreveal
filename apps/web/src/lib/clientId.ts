const STORAGE_KEY = 'owr-client-id';

function generateId(): string {
  // crypto.randomUUID() needs a secure context (HTTPS or localhost) and
  // throws otherwise (e.g. testing over a plain-HTTP LAN address). This is
  // just an anonymous scoping token, not a security credential, so a
  // Math.random()-based fallback is perfectly fine when it's unavailable.
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch {
      // fall through
    }
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getClientId(): string {
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = generateId();
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}
