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
import { CareService } from './care.service';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../account/account.enum';
import {
  CurrentAccount,
  ICurrentAccount
} from '../../decorators/account.decorator';
import { CreateCareDto, UpdateCareDto } from '../care/care.dto';

@Controller('cares')
export class CareController {
  constructor(private readonly careService: CareService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  createCare(
    @CurrentAccount() account: ICurrentAccount,
    @Body() body: CreateCareDto
  ) {
    return this.careService.create(account, body);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  updateCare(
    @CurrentAccount() account: ICurrentAccount,
    @Body() body: UpdateCareDto,
    @Param('id') careId: string
  ) {
    return this.careService.update(account, careId, body);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  getCares(@CurrentAccount() account: ICurrentAccount) {
    return this.careService.getByFilter(account);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  getMember(
    @CurrentAccount() account: ICurrentAccount,
    @Param('id') careId: string
  ) {
    return this.careService.getOne(account, careId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  deleteCare() {
    return this.careService.delete();
  }

  @Get('/members/:memberId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  getMemberCares(
    @CurrentAccount() account: ICurrentAccount,
    @Param('memberId') memberId: string
  ) {
    return this.careService.getMemberCares(account, memberId);
  }
}
