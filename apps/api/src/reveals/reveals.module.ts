import { Module } from '@nestjs/common';
import { RevealsController } from './reveals.controller';
import { RevealsService } from './reveals.service';

@Module({
  controllers: [RevealsController],
  providers: [RevealsService],
})
export class RevealsModule {}
