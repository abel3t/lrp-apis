import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { DiscipleshipProcess, Gender, MaritalStatus } from '../person.enum';
import { Friend } from './friend.dto';

class Curator {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  name: string;
}

export class CreateMemberDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Curator)
  curator: Curator;

  @IsOptional()
  @ValidateNested()
  @Type(() => Friend)
  friend: Friend;

  @IsOptional()
  @IsString()
  gender?: Gender;

  @IsOptional()
  @IsString()
  birthday?: string;

  @IsOptional()
  @IsString()
  career?: string;

  @IsOptional()
  @IsString()
  discipleshipProcess?: DiscipleshipProcess;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  maritalStatus?: MaritalStatus;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  believeInJesusDay?: string;

  @IsOptional()
  @IsString()
  firstComeToLEC?: string;

  @IsOptional()
  @IsString()
  baptismalDay?: string;

  @IsOptional()
  @IsString()
  memberDay?: string;

  @IsOptional()
  @IsString()
  introducedBy?: string;

  @IsOptional()
  @IsString()
  newLifeMentor?: string;

  @IsOptional()
  @IsString()
  weddingDate?: string;

  @IsOptional()
  @IsString()
  hometown?: string;
}

export class UpdateMemberDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Curator)
  curator: Curator;

  @IsOptional()
  @ValidateNested()
  @Type(() => Friend)
  friend: Friend;

  @IsOptional()
  @IsString()
  gender?: Gender;

  @IsOptional()
  @IsString()
  birthday?: string;

  @IsOptional()
  @IsString()
  baptismalDay?: string;

  @IsOptional()
  @IsString()
  career?: string;

  @IsOptional()
  @IsString()
  discipleshipProcess?: DiscipleshipProcess;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  maritalStatus?: MaritalStatus;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  believeInJesusDay?: string;

  @IsOptional()
  @IsString()
  firstComeToLEC?: string;

  @IsOptional()
  @IsString()
  introducedBy?: string;

  @IsOptional()
  @IsString()
  newLifeMentor?: string;

  @IsOptional()
  @IsString()
  weddingDate?: string;

  @IsOptional()
  @IsString()
  hometown?: string;
}

export class AssignMemberForCuratorDto {
  @IsOptional()
  @IsString()
  curatorId?: string;

  @IsOptional()
  @IsString()
  memberId?: string;
}

export class GetMembersDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  curatorId: string;
}
