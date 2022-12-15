import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../account/account.enum';
import {
  CurrentAccount,
  ICurrentAccount
} from '../../decorators/account.decorator';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  getOverview(@CurrentAccount() account: ICurrentAccount) {
    return this.dashboardService.getOverview(account);
  }

  @Get('needing-more-care')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  getNeedingMoreCareMembers(@CurrentAccount() account: ICurrentAccount) {
    return this.dashboardService.getNeedingMoreCareMembers(account);
  }

  @Get('top-caring')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  getTopCaringPeople(@CurrentAccount() account: ICurrentAccount) {
    return this.dashboardService.getTopCaringPeople(account);
  }
}
