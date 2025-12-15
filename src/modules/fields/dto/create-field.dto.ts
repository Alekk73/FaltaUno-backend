import { IsNumber, MinLength } from 'class-validator';

export class CreateFieldDto {
  @IsNumber()
  numero_cancha?: number;
}
