import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateFieldDto {
  @ApiProperty({ example: 'Cancha 1' })
  @IsString()
  @MinLength(3)
  nombre: string;
}
