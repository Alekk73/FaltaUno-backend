import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { RolesUser } from 'src/common/enums/roles-user.enum';
import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Juan' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  nombre?: string;

  @ApiPropertyOptional({ example: 'Pérez' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  apellido?: string;

  @ApiPropertyOptional({ example: 'juan@mail.com' })
  @IsOptional()
  @IsEmail()
  correo_electronico?: string;

  // REVISAR!!!
  @ApiHideProperty()
  @IsOptional()
  @IsString()
  @Length(1, 255)
  contrasena_hash?: string;

  @ApiHideProperty()
  @IsOptional()
  @IsEnum(RolesUser)
  rol?: RolesUser;

  @ApiHideProperty()
  @IsOptional()
  equipo?: number;
}
