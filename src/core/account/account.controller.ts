import { Controller, Get, Post } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('global-admins')
  createGlobalAdminAccount() {
    return this.accountService.createGlobalAdmin();
  }

  @Post('login')
  login() {
    return this.accountService.login();
  }

  @Get('/profile')
  getAccount(): string {
    return this.accountService.getAccount();
  }
}
