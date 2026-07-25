import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { RevealsModule } from './reveals/reveals.module';

@Module({
  imports: [PrismaModule, RevealsModule],
})
export class AppModule {}
