import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from '../account/account.enum';

export class CreateOrganizationDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateOrganizationDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  name: string;
}

export class CreateOrganizationAdminDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsIn(Object.values(Role))
  role: Role;
}
