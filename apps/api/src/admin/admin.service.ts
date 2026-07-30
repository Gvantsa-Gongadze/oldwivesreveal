import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { AdminReveal, AdminRevealsResponse } from '@oldwivesreveal/shared-types';
import { PrismaService } from '../prisma/prisma.service';
import { toReveal } from '../reveals/reveal.mapper';

function parseFilterDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export interface AdminFindAllFilters {
  motherBirthDate?: string;
  fatherBirthDate?: string;
}

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(limit = 50, offset = 0, filters: AdminFindAllFilters = {}): Promise<AdminRevealsResponse> {
    const take = Math.min(Math.max(limit, 1), 200);
    const skip = Math.max(offset, 0);

    const where: Prisma.RevealWhereInput = {};
    const motherBirthDate = parseFilterDate(filters.motherBirthDate);
    const fatherBirthDate = parseFilterDate(filters.fatherBirthDate);
    if (motherBirthDate) where.motherBirthDate = motherBirthDate;
    if (fatherBirthDate) where.fatherBirthDate = fatherBirthDate;

    const [records, total] = await Promise.all([
      this.prisma.reveal.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      this.prisma.reveal.count({ where }),
    ]);

    const items: AdminReveal[] = records.map((record) => ({
      ...toReveal(record),
      clientId: record.clientId,
    }));

    return { items, total };
  }
}
