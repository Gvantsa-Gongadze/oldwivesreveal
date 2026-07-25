const YEAR = 365.2425;

export function formatSinceRenewal(remainderYears: number): string {
  const totalDays = Math.round(remainderYears * YEAR);
  const y = Math.floor(totalDays / YEAR);
  const d = Math.round(totalDays - y * YEAR);
  return y <= 0 ? `${d}d since renewal` : `${y}y ${d}d since renewal`;
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
