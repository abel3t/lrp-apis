import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateTeamDto {
  @IsOptional()
  @IsString()
  name?: string;
}
