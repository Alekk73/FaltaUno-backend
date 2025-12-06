import { IsNotEmpty, IsEmail } from 'class-validator';

export class MailChangePasswordDto {
  @IsNotEmpty()
  @IsEmail()
  correo_electronico: string;
}
