import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class MailChangePasswordDto {
  @ApiProperty({ example: 'usuario@example.com' })
  @IsNotEmpty()
  @IsEmail()
  correo_electronico: string;
}
