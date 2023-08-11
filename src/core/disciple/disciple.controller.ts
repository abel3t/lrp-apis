import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { DiscipleService } from './disciple.service';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../account/account.enum';
import {
  CurrentAccount,
  ICurrentAccount
} from '../../decorators/account.decorator';
import {
  CreateDiscipleDto,
  GetDisciplesDto,
  UpdateDiscipleDto
} from './disciple.dto';

@Controller('disciples')
export class DiscipleController {
  constructor(private readonly discipleService: DiscipleService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  createDisciple(
    @CurrentAccount() account: ICurrentAccount,
    @Body() body: CreateDiscipleDto
  ) {
    return this.discipleService.create(account, body);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  updateDisciple(
    @CurrentAccount() account: ICurrentAccount,
    @Body() body: UpdateDiscipleDto,
    @Param('id') discipleId: string
  ) {
    return this.discipleService.update(account, discipleId, body);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  getDisciples(
    @CurrentAccount() account: ICurrentAccount,
    @Query() filter: GetDisciplesDto
  ) {
    return this.discipleService.getByFilter(account, filter || {});
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  getMember(
    @CurrentAccount() account: ICurrentAccount,
    @Param('id') discipleId: string
  ) {
    return this.discipleService.getOne(account, discipleId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  deleteDisciple() {
    return this.discipleService.delete();
  }

  @Get('/members/:memberId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  getMemberDisciples(
    @CurrentAccount() account: ICurrentAccount,
    @Param('memberId') memberId: string
  ) {
    return this.discipleService.getMemberDisciples(account, memberId);
  }
}
