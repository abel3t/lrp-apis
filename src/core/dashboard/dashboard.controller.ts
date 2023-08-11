import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../account/account.enum';
import {
  CurrentAccount,
  ICurrentAccount
} from '../../decorators/account.decorator';
import {
  NeedingMoreCareDto,
  OverviewDto, PresentDto,
  TopCaringPeopleDto
} from "./dashboard.dto";

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  getOverview(
    @CurrentAccount() account: ICurrentAccount,
    @Query() filter: OverviewDto
  ) {
    return this.dashboardService.getOverview(account, filter);
  }

  @Get('needing-more-care')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  getNeedingMoreCareMembers(
    @CurrentAccount() account: ICurrentAccount,
    @Query() filter: NeedingMoreCareDto
  ) {
    return this.dashboardService.getNeedingMoreCareMembers(account, filter);
  }

  @Get('top-caring')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  getTopCaringPeople(
    @CurrentAccount() account: ICurrentAccount,
    @Query() filter: TopCaringPeopleDto
  ) {
    return this.dashboardService.getTopCaringPeople(account, filter);
  }

  @Get('presents')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  getPresent(
    @CurrentAccount() account: ICurrentAccount,
    @Query() filter: PresentDto
  ) {
    return this.dashboardService.getPresents(account, filter);
  }
}
