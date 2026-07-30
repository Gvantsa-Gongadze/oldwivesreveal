import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { RevealsModule } from './reveals/reveals.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [PrismaModule, RevealsModule, AdminModule],
})
export class AppModule {}
