import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { DiscipleshipProcess, Gender, MaritalStatus } from './member.enum';
import { Type } from 'class-transformer';

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
  introducedBy?: string;

  @IsOptional()
  @IsString()
  newLifeMentor?: string;

  @IsOptional()
  @IsString()
  memberClassDay?: string;

  @IsOptional()
  @IsString()
  walkWithGodClassDay?: string;

  @IsOptional()
  @IsString()
  weddingDate?: string;

  @IsOptional()
  @IsString()
  giveChildDay?: string;

  @IsOptional()
  @IsString()
  hometown?: string;

  @IsOptional()
  @IsString()
  otherRole?: string;
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
  introducedBy?: string;

  @IsOptional()
  @IsString()
  newLifeMentor?: string;

  @IsOptional()
  @IsString()
  memberClassDay?: string;

  @IsOptional()
  @IsString()
  walkWithGodClassDay?: string;

  @IsOptional()
  @IsString()
  weddingDate?: string;

  @IsOptional()
  @IsString()
  giveChildDay?: string;

  @IsOptional()
  @IsString()
  hometown?: string;

  @IsOptional()
  @IsString()
  otherRole?: string;
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
