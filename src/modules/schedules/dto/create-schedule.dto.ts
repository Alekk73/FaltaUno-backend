import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty()
  @IsDateString()
  hora_dia: string;

  @IsNotEmpty()
  @IsNumber()
  matchId: number;
}
