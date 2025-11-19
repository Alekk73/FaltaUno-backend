import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { MatchSchedules } from 'src/common/enums/match-schedules';

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
  @IsEnum(MatchSchedules)
  hora: MatchSchedules;

  @IsNotEmpty()
  @IsString()
  dia: Date;

  @ValidateNested()
  @Type(() => PartidoDto)
  partido: PartidoDto;
}
