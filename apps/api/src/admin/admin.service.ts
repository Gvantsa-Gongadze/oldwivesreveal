import { Injectable } from '@nestjs/common';
import type { AdminReveal, AdminRevealsResponse } from '@oldwivesreveal/shared-types';
import { PrismaService } from '../prisma/prisma.service';
import { toReveal } from '../reveals/reveal.mapper';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(limit = 50, offset = 0): Promise<AdminRevealsResponse> {
    const take = Math.min(Math.max(limit, 1), 200);
    const skip = Math.max(offset, 0);

    const [records, total] = await Promise.all([
      this.prisma.reveal.findMany({
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      this.prisma.reveal.count(),
    ]);

    const items: AdminReveal[] = records.map((record) => ({
      ...toReveal(record),
      clientId: record.clientId,
    }));

    return { items, total };
  }
}
