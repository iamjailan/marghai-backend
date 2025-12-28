import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  salary: string;

  @IsDateString()
  deadline: Date;

  @IsString()
  @IsNotEmpty()
  description: string;
}
