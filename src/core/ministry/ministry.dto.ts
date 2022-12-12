import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMinistryDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateMinistryDto {
  @IsOptional()
  @IsString()
  name?: string;
}
