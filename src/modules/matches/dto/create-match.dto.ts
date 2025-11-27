import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

class PartidoDto {
  @IsNotEmpty()
  @IsNumber()
  canchaId: number;

  @IsNumber()
  @IsOptional()
  contrincante?: number;
}

export class CreateMatchDto {
  @IsNotEmpty()
  @IsDateString()
  hora_dia: string;

  @ValidateNested()
  @Type(() => PartidoDto)
  partido: PartidoDto;
}
