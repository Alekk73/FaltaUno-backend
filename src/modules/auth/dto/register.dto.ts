import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Juan' })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'Pérez' })
  @IsNotEmpty()
  @IsString()
  apellido: string;

  @ApiProperty({ example: 'juan@mail.com' })
  @IsEmail()
  correo_electronico: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  @Transform(({ value }) => value.trim())
  contrasena: string;
}
