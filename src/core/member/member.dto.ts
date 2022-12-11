import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Gender, MaritalStatus } from './member.enum';

export class CreateMemberDto {
  @IsNotEmpty()
  @IsString()
  name: string;

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
