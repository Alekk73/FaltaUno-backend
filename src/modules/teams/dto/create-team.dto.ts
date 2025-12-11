import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ example: 'Team 1' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(75)
  nombre: string;
}
