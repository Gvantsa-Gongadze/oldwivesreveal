import { BadRequestException, Injectable } from '@nestjs/common';
import { Reveal as RevealRecord } from '@prisma/client';
import { calculateReveal, type Reveal, type CreateRevealRequest } from '@oldwivesreveal/shared-types';
import { PrismaService } from '../prisma/prisma.service';

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function toReveal(record: RevealRecord): Reveal {
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

@Injectable()
export class RevealsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateRevealRequest, clientId: string | null): Promise<Reveal> {
    let outcome;
    try {
      outcome = calculateReveal(input);
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }

    const record = await this.prisma.reveal.create({
      data: {
        clientId,
        fatherBirthDate: new Date(`${input.fatherBirthDate}T00:00:00Z`),
        motherBirthDate: new Date(`${input.motherBirthDate}T00:00:00Z`),
        reckonDate: new Date(`${input.reckonDate}T00:00:00Z`),
        fatherRemainderYears: outcome.father.remainderYears,
        fatherAngleDeg: outcome.father.angleDeg,
        fatherAgeYears: outcome.father.ageYears,
        motherRemainderYears: outcome.mother.remainderYears,
        motherAngleDeg: outcome.mother.angleDeg,
        motherAgeYears: outcome.mother.ageYears,
        newerParent: outcome.newerParent,
        motherOlder: outcome.motherOlder,
        result: outcome.result,
      },
    });

    return toReveal(record);
  }

  async findAll(clientId: string | null, limit = 25): Promise<Reveal[]> {
    if (!clientId) {
      return [];
    }
    const records = await this.prisma.reveal.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(limit, 1), 100),
    });
    return records.map(toReveal);
  }

  async findOne(id: string): Promise<Reveal | null> {
    const record = await this.prisma.reveal.findUnique({ where: { id } });
    return record ? toReveal(record) : null;
  }
}
