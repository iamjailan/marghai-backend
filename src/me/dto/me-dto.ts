import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateMe {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsOptional()
  profile_picture: string;

  @IsString()
  @IsOptional()
  company: string;

  @IsString()
  @IsOptional()
  location: string;

  @IsString()
  @IsOptional()
  phone: string;
}
