import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateInvitationDto {
  @IsNotEmpty()
  @IsNumber()
  invitadoId: number;
}
