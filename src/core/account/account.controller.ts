import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateGlobalAdminDto, LoginDto } from './account.dto';

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
  getAccount(): string {
    return this.accountService.getAccount();
  }
}
