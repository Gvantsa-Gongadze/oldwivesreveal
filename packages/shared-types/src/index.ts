export type RevealResult = 'BOY' | 'GIRL' | 'TIE';
export type NewerParent = 'father' | 'mother' | 'tie';

export interface CreateRevealRequest {
  /** ISO date string, YYYY-MM-DD */
  fatherBirthDate: string;
  /** ISO date string, YYYY-MM-DD */
  motherBirthDate: string;
  /** ISO date string, YYYY-MM-DD */
  reckonDate: string;
}

export interface DialReading {
  /** Years since this parent's last cycle renewal (0 = just renewed) */
  remainderYears: number;
  /** Length of this parent's renewal cycle in years (4 for father, 3 for mother) */
  cycleYears: number;
  /** Position within the cycle, in degrees, for rendering a dial (0-360) */
  angleDeg: number;
  /** This parent's exact age at the reckoning date, in years */
  ageYears: number;
}

export interface Reveal extends CreateRevealRequest {
  id: string;
  father: DialReading;
  mother: DialReading;
  newerParent: NewerParent;
  motherOlder: boolean;
  result: RevealResult;
  createdAt: string;
}

/** A Reveal plus the anonymous device id that created it, for the admin listing only. */
export interface AdminReveal extends Reveal {
  clientId: string | null;
}

export interface AdminRevealsResponse {
  items: AdminReveal[];
  total: number;
}

const MS_PER_DAY = 86_400_000;
const YEAR = 365.2425;
const FATHER_CYCLE_YEARS = 4;
const MOTHER_CYCLE_YEARS = 3;
/** Remainders within a day of each other count as a tie. */
const TIE_EPSILON_YEARS = 1 / YEAR;

function parseIsoDate(value: string): Date {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }
  return date;
}

function ageInYears(birthDate: Date, referenceDate: Date): number {
  return (referenceDate.getTime() - birthDate.getTime()) / MS_PER_DAY / YEAR;
}

function cycleRemainder(ageYears: number, cycleYears: number): number {
  const remainder = ageYears % cycleYears;
  return remainder < 0 ? remainder + cycleYears : remainder;
}

function buildDialReading(ageYears: number, cycleYears: number): DialReading {
  const remainderYears = cycleRemainder(ageYears, cycleYears);
  return {
    remainderYears,
    cycleYears,
    angleDeg: (remainderYears / cycleYears) * 360,
    ageYears,
  };
}

/**
 * Pure calculation of the "old wives' reveal" reckoning. No side effects,
 * so it can run identically on the API (source of truth, persisted) or
 * in a UI preview if ever needed.
 */
export function calculateReveal(input: CreateRevealRequest): Omit<Reveal, 'id' | 'createdAt'> {
  const fatherBirth = parseIsoDate(input.fatherBirthDate);
  const motherBirth = parseIsoDate(input.motherBirthDate);
  const reckonDate = parseIsoDate(input.reckonDate);

  if (reckonDate < fatherBirth || reckonDate < motherBirth) {
    throw new Error('Reckoning date falls before a birth date.');
  }

  const father = buildDialReading(ageInYears(fatherBirth, reckonDate), FATHER_CYCLE_YEARS);
  const mother = buildDialReading(ageInYears(motherBirth, reckonDate), MOTHER_CYCLE_YEARS);

  const diff = father.remainderYears - mother.remainderYears;

  let newerParent: NewerParent;
  let base: RevealResult;
  if (Math.abs(diff) < TIE_EPSILON_YEARS) {
    newerParent = 'tie';
    base = 'TIE';
  } else if (diff < 0) {
    newerParent = 'father';
    base = 'BOY';
  } else {
    newerParent = 'mother';
    base = 'GIRL';
  }

  const motherOlder = motherBirth.getTime() < fatherBirth.getTime();
  const result: RevealResult =
    base === 'TIE' ? 'TIE' : motherOlder ? (base === 'BOY' ? 'GIRL' : 'BOY') : base;

  return {
    fatherBirthDate: input.fatherBirthDate,
    motherBirthDate: input.motherBirthDate,
    reckonDate: input.reckonDate,
    father,
    mother,
    newerParent,
    motherOlder,
    result,
  };
}

export interface ResultWindow {
  /** ISO date, inclusive start of this window. */
  from: string;
  /** ISO date, exclusive end of this window (start of the next one). */
  to: string;
  result: RevealResult;
}

function addCalendarYears(date: Date, years: number): Date {
  const next = new Date(date.getTime());
  next.setUTCFullYear(next.getUTCFullYear() + years);
  return next;
}

function wholeCyclesElapsed(birth: Date, from: Date, cycleYears: number): number {
  let years = from.getUTCFullYear() - birth.getUTCFullYear();
  const beforeAnniversary =
    from.getUTCMonth() < birth.getUTCMonth() ||
    (from.getUTCMonth() === birth.getUTCMonth() && from.getUTCDate() < birth.getUTCDate());
  if (beforeAnniversary) {
    years -= 1;
  }
  return Math.floor(years / cycleYears);
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * The reading only ever flips on a parent's cycle anniversary (both ages
 * advance at the same rate, so the gap between them is flat in between),
 * which means the timeline splits cleanly into BOY/GIRL/TIE stretches
 * bounded by whichever parent's renewal date comes next. This walks that
 * timeline forward from `options.from`.
 */
export function buildResultWindows(
  input: Pick<CreateRevealRequest, 'fatherBirthDate' | 'motherBirthDate'>,
  options: { from?: string; windowCount?: number } = {},
): ResultWindow[] {
  const fatherBirth = parseIsoDate(input.fatherBirthDate);
  const motherBirth = parseIsoDate(input.motherBirthDate);
  const from = options.from ? parseIsoDate(options.from) : new Date();
  const windowCount = Math.min(Math.max(options.windowCount ?? 6, 1), 24);

  if (from < fatherBirth || from < motherBirth) {
    throw new Error('Reference date falls before a birth date.');
  }

  let fatherCycles = wholeCyclesElapsed(fatherBirth, from, FATHER_CYCLE_YEARS);
  let motherCycles = wholeCyclesElapsed(motherBirth, from, MOTHER_CYCLE_YEARS);

  const prevFatherEvent = addCalendarYears(fatherBirth, fatherCycles * FATHER_CYCLE_YEARS);
  const prevMotherEvent = addCalendarYears(motherBirth, motherCycles * MOTHER_CYCLE_YEARS);
  let windowStart = prevFatherEvent > prevMotherEvent ? prevFatherEvent : prevMotherEvent;
  let nextFatherEvent = addCalendarYears(fatherBirth, (fatherCycles + 1) * FATHER_CYCLE_YEARS);
  let nextMotherEvent = addCalendarYears(motherBirth, (motherCycles + 1) * MOTHER_CYCLE_YEARS);

  const windows: ResultWindow[] = [];
  for (let i = 0; i < windowCount; i++) {
    const windowEnd = nextFatherEvent < nextMotherEvent ? nextFatherEvent : nextMotherEvent;
    const midpoint = new Date((windowStart.getTime() + windowEnd.getTime()) / 2);

    const { result } = calculateReveal({
      fatherBirthDate: input.fatherBirthDate,
      motherBirthDate: input.motherBirthDate,
      reckonDate: toIsoDate(midpoint),
    });

    windows.push({ from: toIsoDate(windowStart), to: toIsoDate(windowEnd), result });

    if (nextFatherEvent.getTime() === windowEnd.getTime()) {
      fatherCycles += 1;
      nextFatherEvent = addCalendarYears(fatherBirth, (fatherCycles + 1) * FATHER_CYCLE_YEARS);
    }
    if (nextMotherEvent.getTime() === windowEnd.getTime()) {
      motherCycles += 1;
      nextMotherEvent = addCalendarYears(motherBirth, (motherCycles + 1) * MOTHER_CYCLE_YEARS);
    }
    windowStart = windowEnd;
  }

  return windows;
}
