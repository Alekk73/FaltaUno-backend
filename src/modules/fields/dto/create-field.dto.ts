import { IsString, MinLength } from 'class-validator';

export class CreateFieldDto {
  @IsString()
  @MinLength(3)
  nombre: string;
}
