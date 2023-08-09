import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { CarePriority, CareType, DateFilterSet } from './care.enum';
import { Transform, Type } from 'class-transformer';

class CareMember {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  name: string;
}

export class CreateCareDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CareMember)
  member: CareMember;

  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(CareType))
  type: CareType;

  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(CarePriority))
  priority: CarePriority;

  @IsNotEmpty()
  @IsString()
  date: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;
}

export class UpdateCareDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CareMember)
  member: CareMember;

  @IsOptional()
  @IsString()
  @IsIn(Object.values(CareType))
  type: CareType;

  @IsOptional()
  @IsString()
  @IsIn(Object.values(CarePriority))
  priority: CarePriority;

  @IsOptional()
  @IsString()
  date?: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;
}

export class GetCaresDto {
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
