import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  jobType: string;

  @IsString()
  @IsNotEmpty()
  salary: string;

  @IsDateString()
  deadline: Date;

  @IsString()
  @IsNotEmpty()
  description: string;
}
