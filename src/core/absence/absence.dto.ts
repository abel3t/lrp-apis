import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { AbsenceType } from './absence.enum';
import { DateFilterSet } from '../care/care.enum';
import { convertToStartOfUtcDate, isValidDateString } from '../../shared/utils/date.util';

class AbsenceMember {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  name: string;
}

export class CreateAbsenceDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AbsenceMember)
  member: AbsenceMember;

  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(AbsenceType))
  type: AbsenceType;

  @IsNotEmpty()
  @Transform(({ value }) =>
    isValidDateString(value) ? convertToStartOfUtcDate(value) : null
  )
  date: Date;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateAbsenceDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AbsenceMember)
  member: AbsenceMember;

  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(AbsenceType))
  type: AbsenceType;

  @IsNotEmpty()
  @IsString()
  date: Date;

  @IsOptional()
  @IsString()
  description?: string;
}

export class GetAbsencesDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) =>
    Number.parseInt(value) ? Number.parseInt(value) : 0
  )
  set?: DateFilterSet;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  curatorId?: string;

  @IsOptional()
  @IsString()
  memberId?: string;
}
