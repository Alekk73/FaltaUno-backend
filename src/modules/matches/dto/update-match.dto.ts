import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchDto } from './create-match.dto';
import { IsNumber } from 'class-validator';

export class UpdateMatchDto extends PartialType(CreateMatchDto) {
  @IsNumber()
  goles_local?: number;

  @IsNumber()
  goles_visitante?: number;
}
