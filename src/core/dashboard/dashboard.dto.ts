import { IsIn, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { DateFilterSet } from '../care/care.enum';
import { PresentReportType } from './dashboard.enum';

export class OverviewDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) =>
    Number.parseInt(value) ? Number.parseInt(value) : 0
  )
  set?: DateFilterSet;
}

export class NeedingMoreCareDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) =>
    Number.parseInt(value) ? Number.parseInt(value) : 0
  )
  set?: DateFilterSet;
}

export class TopCaringPeopleDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) =>
    Number.parseInt(value) ? Number.parseInt(value) : 0
  )
  set?: DateFilterSet;
}

export class PresentDto {
  @IsOptional()
  @IsIn(Object.values(PresentReportType))
  type?: PresentReportType;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) =>
    Number.parseInt(value) ? Number.parseInt(value) : 5
  )
  amount?: number;
}
