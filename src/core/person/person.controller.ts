import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../account/account.enum';
import {
  CurrentAccount,
  ICurrentAccount
} from '../../decorators/account.decorator';
import { PeopleService } from './personal.service';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon, Role.Missionary)
  getFriends(@CurrentAccount() account: ICurrentAccount) {
    return this.peopleService.getByFilter(account);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon, Role.Missionary)
  getMember(
    @CurrentAccount() account: ICurrentAccount,
    @Param('id') peopleId: string
  ) {
    return this.peopleService.getOne(account, peopleId);
  }
}
