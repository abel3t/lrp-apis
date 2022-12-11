import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateGlobalAdminDto, LoginDto } from './account.dto';
import { AuthGuard } from 'guards/auth.guard';
import { Roles } from 'decorators/roles.decorator';
import { GlobalRole } from './account.enum';
import { RolesGuard } from 'guards/roles.guard';
import { CurrentAccount, ICurrentAccount } from 'decorators/account.decorator';

@Controller()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('global-admins')
  createGlobalAdminAccount(
    @Body() body: CreateGlobalAdminDto,
    @Res() res: any
  ) {
    return this.accountService.createGlobalAdmin(body);
  }

  @Post('login')
  login(
    @Body() body: LoginDto
  ) {
    return this.accountService.login(body);
  }

  @Get('/profile')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(GlobalRole.Global_Admin)
  getAccount(
    @CurrentAccount() { username }: ICurrentAccount
  ) {
    return this.accountService.getAccount(username);
  }
}
