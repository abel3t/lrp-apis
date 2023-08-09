import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';
import { PersonalType } from '../person.enum';

export class CreateFriendDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(PersonalType))
  type: PersonalType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  hometown?: string;

  @IsOptional()
  @IsString()
  birthday?: Date;

  @IsOptional()
  @IsString()
  introducedBy?: string;
}

export class UpdateFriendDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: PersonalType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  introducedBy?: string;
}
