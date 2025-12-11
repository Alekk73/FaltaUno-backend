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
  @ApiProperty({ example: 'Pepe' })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'Argento' })
  @IsNotEmpty()
  @IsString()
  apellido: string;

  @ApiProperty({ example: 'popeargento@mail.com' })
  @IsNotEmpty()
  @IsEmail()
  correo_electronico: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{8,10}$/, {
    message: 'El documento debe ser numérico y tener entre 8 y 10 dígitos.',
  })
  @Transform(({ value }) => value.trim())
  documento: string;

  @ApiProperty({ example: 'A_a123456' })
  @IsNotEmpty()
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
