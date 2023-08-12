import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { PersonalType } from '../person.enum';
import { Type } from 'class-transformer';

export class Friend {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  name: string;
}

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
  @ValidateNested()
  @Type(() => Friend)
  friend: Friend;

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
  firstComeToLEC?: Date;

  @IsOptional()
  @IsString()
  believeInJesusDay?: Date;

  @IsOptional()
  @IsString()
  baptismalDay?: Date;

  @IsOptional()
  @IsString()
  memberDay?: Date;
}

export class UpdateFriendDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: PersonalType;

  @IsOptional()
  @ValidateNested()
  @Type(() => Friend)
  friend: Friend;

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
  firstComeToLEC?: Date;

  @IsOptional()
  @IsString()
  believeInJesusDay?: Date;

  @IsOptional()
  @IsString()
  baptismalDay?: Date;

  @IsOptional()
  @IsString()
  memberDay?: Date;
}
