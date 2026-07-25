import { IsDateString } from 'class-validator';
import type { CreateRevealRequest } from '@oldwivesreveal/shared-types';

export class CreateRevealDto implements CreateRevealRequest {
  @IsDateString()
  fatherBirthDate!: string;

  @IsDateString()
  motherBirthDate!: string;

  @IsDateString()
  reckonDate!: string;
}
