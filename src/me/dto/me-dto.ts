import { IsOptional, IsString } from 'class-validator';

export class UpdateMe {
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
