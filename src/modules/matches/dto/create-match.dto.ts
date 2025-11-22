import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';

class PartidoDto {
  @IsNotEmpty()
  @IsNumber()
  canchaId: number;

  @IsNotEmpty()
  @IsNumber()
  contrincante: number;
}

export class CreateMatchDto {
  @IsNotEmpty()
  @IsDateString()
  hora_dia: string;

  @ValidateNested()
  @Type(() => PartidoDto)
  partido: PartidoDto;
}
