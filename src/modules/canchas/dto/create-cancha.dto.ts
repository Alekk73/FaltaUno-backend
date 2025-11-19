import { IsString, MinLength } from "class-validator";

export class CreateCanchaDto {
  @IsString()
  @MinLength(3)
  nombre: string;
}
