const STORAGE_KEY = 'owr-admin-token';

// sessionStorage, not localStorage: this token is a shared admin password,
// not a per-device id, so it shouldn't outlive the tab.
export function getAdminToken(): string | null {
  return sessionStorage.getItem(STORAGE_KEY);
}

export function setAdminToken(token: string): void {
  sessionStorage.setItem(STORAGE_KEY, token);
}

export function clearAdminToken(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
