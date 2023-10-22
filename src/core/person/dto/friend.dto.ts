import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { PersonalType } from '../person.enum';
import { Transform, Type } from 'class-transformer';
import {
  convertToStartOfUtcDate,
  isValidDateString
} from '../../../shared/utils/date.util';

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
  @Transform(({ value }) =>
    isValidDateString(value) ? convertToStartOfUtcDate(value) : null
  )
  birthday?: Date;

  @IsOptional()
  @Transform(({ value }) =>
    isValidDateString(value) ? convertToStartOfUtcDate(value) : null
  )
  firstComeToLEC?: Date;

  @Transform(({ value }) =>
    isValidDateString(value) ? convertToStartOfUtcDate(value) : null
  )
  believeInJesusDay?: Date;

  @Transform(({ value }) =>
    isValidDateString(value) ? convertToStartOfUtcDate(value) : null
  )
  baptismalDay?: Date;

  @IsOptional()
  @Transform(({ value }) =>
    isValidDateString(value) ? convertToStartOfUtcDate(value) : null
  )
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
  @Transform(({ value }) =>
    isValidDateString(value) ? convertToStartOfUtcDate(value) : null
  )
  firstComeToLEC?: Date;

  @IsOptional()
  @Transform(({ value }) =>
    isValidDateString(value) ? convertToStartOfUtcDate(value) : null
  )
  believeInJesusDay?: Date;

  @IsOptional()
  @Transform(({ value }) =>
    isValidDateString(value) ? convertToStartOfUtcDate(value) : null
  )
  baptismalDay?: Date;

  @IsOptional()
  @Transform(({ value }) =>
    isValidDateString(value) ? convertToStartOfUtcDate(value) : null
  )
  memberDay?: Date;
}

export class GetFriendsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  curatorId: string;
}
