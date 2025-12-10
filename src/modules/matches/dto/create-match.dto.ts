import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

class MatchDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  @IsNumber()
  canchaId: number;

  @ApiProperty({ example: '1', required: false })
  @IsNumber()
  @IsOptional()
  contrincante?: number;
}

export class CreateMatchDto {
  @ApiProperty({
    description: 'Fecha y hora del partido',
    example: '2025-12-25T18:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  hora_dia: string;

  @ApiProperty({
    description: 'Detalles del partido, incluyendo el equipo y contrincante',
    type: MatchDto,
  })
  @ValidateNested()
  @Type(() => MatchDto)
  partido: MatchDto;
}
