import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
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

  @ApiProperty({ example: 'A_a123456' })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener mínimo 8 caracteres.' })
  @Matches(/[A-Z]/, {
    message: 'La contraseña debe tener al menos una letra mayúscula.',
  })
  @Matches(/[a-z]/, {
    message: 'La contraseña debe tener al menos una letra minúscula.',
  })
  @Matches(/\d/, { message: 'La contraseña debe tener al menos un número.' })
  @Matches(/[!@#$%^&*(),.?":{}|<>_]/, {
    message: 'La contraseña debe tener al menos un carácter especial.',
  })
  @Transform(({ value }) => value.trim())
  contrasena: string;
}
