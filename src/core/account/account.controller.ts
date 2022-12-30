import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Res,
  UseGuards
} from '@nestjs/common';
import { AccountService } from './account.service';
import {
  ChangePasswordDto,
  CreateGlobalAdminDto,
  LoginDto,
  RefreshTokenDto
} from './account.dto';
import { AuthGuard } from 'guards/auth.guard';
import { Roles } from 'decorators/roles.decorator';
import { Role } from './account.enum';
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
  login(@Body() body: LoginDto) {
    return this.accountService.login(body);
  }

  @Post('/refresh-token')
  refreshToken(@Body() body: RefreshTokenDto) {
    return this.accountService.refreshToken(body);
  }

  @Get('/profile')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Global_Admin, Role.Pastor, Role.Staff, Role.Deacon)
  getAccount(@CurrentAccount() { username }: ICurrentAccount) {
    return this.accountService.getAccount(username);
  }

  @Put('/change-password')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Global_Admin, Role.Pastor, Role.Staff, Role.Deacon)
  changePassword(
    @CurrentAccount() { username }: ICurrentAccount,
    @Body() body: ChangePasswordDto
  ) {
    return this.accountService.changePassword(username, body);
  }

  @Get('curators')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  getCurators(@CurrentAccount() account: ICurrentAccount) {
    return this.accountService.getCurators(account);
  }
}
