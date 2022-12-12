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
import { MinistryService } from './ministry.service';
import { AuthGuard } from 'guards/auth.guard';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from 'decorators/roles.decorator';
import { Role } from '../account/account.enum';
import { CurrentAccount, ICurrentAccount } from 'decorators/account.decorator';
import { CreateMinistryDto, UpdateMinistryDto } from './ministry.dto';

@Controller('ministries')
export class MinistryController {
  constructor(private readonly ministryService: MinistryService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  createMinistry(
    @CurrentAccount() account: ICurrentAccount,
    @Body() body: CreateMinistryDto
  ) {
    return this.ministryService.create(account, body);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  updateMinistry(
    @CurrentAccount() account: ICurrentAccount,
    @Body() body: UpdateMinistryDto,
    @Param('id') ministryId: string
  ) {
    return this.ministryService.update(account, ministryId, body);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  getMinistrys(@CurrentAccount() account: ICurrentAccount) {
    return this.ministryService.getByFilter(account);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  getMinistry() {
    return this.ministryService.getOne();
  }

  @Delete(':id')
  deleteMinistry() {
    return this.ministryService.delete();
  }

  @Get(':id/members')
  getMembers() {
    return this.ministryService.getMembers();
  }

  @Post(':id/members')
  addMember() {
    return this.ministryService.addMember();
  }

  @Delete(':ministryId/members/:memberId')
  removeMember() {
    return this.ministryService.removeMember();
  }
}
