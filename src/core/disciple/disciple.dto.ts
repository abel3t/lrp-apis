import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { DisciplePriority, DiscipleType, DateFilterSet } from './disciple.enum';
import { Transform, Type } from 'class-transformer';

class DisciplePerson {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  name: string;
}
  
export class CreateDiscipleDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DisciplePerson)
  person: DisciplePerson;

  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(DiscipleType))
  type: DiscipleType;

  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(DisciplePriority))
  priority: DisciplePriority;

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

export class UpdateDiscipleDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => DisciplePerson)
  person: DisciplePerson;

  @IsOptional()
  @IsString()
  @IsIn(Object.values(DiscipleType))
  type: DiscipleType;

  @IsOptional()
  @IsString()
  @IsIn(Object.values(DisciplePriority))
  priority: DisciplePriority;

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

export class GetDisciplesDto {
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
