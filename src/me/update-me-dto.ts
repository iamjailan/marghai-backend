import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from 'src/auth/dto/login';

export class UpdateUserDto extends PartialType(RegisterDto) {}
