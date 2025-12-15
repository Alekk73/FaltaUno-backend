import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEstablishmentDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  nombre: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  direccion: string;

  @IsNotEmpty()
  @IsNumber()
  valor_canchas: number;
}
