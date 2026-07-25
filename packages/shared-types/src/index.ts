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
