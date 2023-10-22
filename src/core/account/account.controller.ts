import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
  createGlobalAdminAccount(@Body() body: CreateGlobalAdminDto) {
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
  @Roles(
    Role.Global_Admin,
    Role.Pastor,
    Role.Staff,
    Role.Deacon,
    Role.Missionary
  )
  getAccount(@CurrentAccount() { username }: ICurrentAccount) {
    return this.accountService.getAccount(username);
  }

  @Delete('/accounts/:username')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Global_Admin)
  deleteAccount(@Param('username') username: string) {
    return this.accountService.deleteAccount(username);
  }

  @Put('/change-password')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    Role.Global_Admin,
    Role.Pastor,
    Role.Staff,
    Role.Deacon,
    Role.Missionary
  )
  changePassword(
    @CurrentAccount() { username }: ICurrentAccount,
    @Body() body: ChangePasswordDto
  ) {
    return this.accountService.changePassword(username, body);
  }

  @Get('curators')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon, Role.Missionary)
  getCurators(@CurrentAccount() account: ICurrentAccount) {
    return this.accountService.getCurators(account);
  }
}
