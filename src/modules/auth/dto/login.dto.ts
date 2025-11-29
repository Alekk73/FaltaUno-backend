import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'pepeargento@mail.com' })
  @IsEmail()
  correo_electronico: string;

  @ApiProperty({ example: 'A_a123456' })
  @IsString()
  @MinLength(6)
  @Transform(({ value }) => value.trim())
  contrasena: string;
}
