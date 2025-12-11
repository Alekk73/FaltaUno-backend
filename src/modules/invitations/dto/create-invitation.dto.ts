import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateInvitationDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  @IsNumber()
  invitadoId: number;
}
