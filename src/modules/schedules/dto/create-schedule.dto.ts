import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty()
  @IsDateString()
  date_time: string;

  @IsNotEmpty()
  @IsNumber()
  fieldId: number;
}