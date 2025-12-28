import { PartialType } from '@nestjs/mapped-types';
import { UpdateMe } from './me-dto';

export class UpdateUserDto extends PartialType(UpdateMe) {}
