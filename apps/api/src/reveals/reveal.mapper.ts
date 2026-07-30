import { Reveal as RevealRecord } from '@prisma/client';
import type { Reveal } from '@oldwivesreveal/shared-types';

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function toReveal(record: RevealRecord): Reveal {
  return {
    id: record.id,
    fatherBirthDate: toIsoDate(record.fatherBirthDate),
    motherBirthDate: toIsoDate(record.motherBirthDate),
    reckonDate: toIsoDate(record.reckonDate),
    father: {
      remainderYears: record.fatherRemainderYears,
      cycleYears: 4,
      angleDeg: record.fatherAngleDeg,
      ageYears: record.fatherAgeYears,
    },
    mother: {
      remainderYears: record.motherRemainderYears,
      cycleYears: 3,
      angleDeg: record.motherAngleDeg,
      ageYears: record.motherAgeYears,
    },
    newerParent: record.newerParent as Reveal['newerParent'],
    motherOlder: record.motherOlder,
    result: record.result as Reveal['result'],
    createdAt: record.createdAt.toISOString(),
  };
}
