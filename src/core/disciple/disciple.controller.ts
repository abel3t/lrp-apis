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
  @Roles(Role.Pastor, Role.Staff, Role.Deacon, Role.Missionary)
  createDisciple(
    @CurrentAccount() account: ICurrentAccount,
    @Body() body: CreateDiscipleDto
  ) {
    return this.discipleService.create(account, body);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon, Role.Missionary)
  updateDisciple(
    @CurrentAccount() account: ICurrentAccount,
    @Body() body: UpdateDiscipleDto,
    @Param('id') discipleId: string
  ) {
    return this.discipleService.update(account, discipleId, body);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon, Role.Missionary)
  getDisciples(
    @CurrentAccount() account: ICurrentAccount,
    @Query() filter: GetDisciplesDto
  ) {
    return this.discipleService.getByFilter(account, filter || {});
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon, Role.Missionary)
  getMember(
    @CurrentAccount() account: ICurrentAccount,
    @Param('id') discipleId: string
  ) {
    return this.discipleService.getOne(account, discipleId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon, Role.Missionary)
  deleteDisciple() {
    return this.discipleService.delete();
  }

  @Get('/people/:memberId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon, Role.Missionary)
  getPersonDisciples(
    @CurrentAccount() account: ICurrentAccount,
    @Param('memberId') memberId: string
  ) {
    return this.discipleService.getPersonDisciples(account, memberId);
  }
}
