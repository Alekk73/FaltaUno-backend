import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, MinLength, Matches, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
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
  nueva_contrasena: string;

  @IsString()
  @IsNotEmpty()
  confirmar_nueva_contrasena: string;
}
