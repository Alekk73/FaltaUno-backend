import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { RolesUser } from 'src/common/enums/roles-user.enum';

export class UpdateUserDto {
  @ApiProperty({ example: 'Pepe' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  nombre?: string;

  @ApiProperty({ example: 'Argento' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  apellido?: string;

  @ApiProperty({ example: 'pepeargento@mail.com' })
  @IsOptional()
  @IsEmail()
  correo_electronico?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  contrasena_hash?: string;

  @IsOptional()
  @IsEnum(RolesUser)
  rol?: RolesUser;

  @IsOptional()
  equipo?: number;
}
