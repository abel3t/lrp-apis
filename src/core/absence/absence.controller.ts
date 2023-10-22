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
import { AbsenceService } from './absence.service';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../account/account.enum';
import {
  CurrentAccount,
  ICurrentAccount
} from '../../decorators/account.decorator';
import {
  CreateAbsenceDto,
  GetAbsencesDto,
  UpdateAbsenceDto
} from './absence.dto';

@Controller('absences')
export class AbsenceController {
  constructor(private readonly absenceService: AbsenceService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  createCare(
    @CurrentAccount() account: ICurrentAccount,
    @Body() body: CreateAbsenceDto
  ) {
    return this.absenceService.create(account, body);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  updateCare(
    @CurrentAccount() account: ICurrentAccount,
    @Body() body: UpdateAbsenceDto,
    @Param('id') careId: string
  ) {
    return this.absenceService.update(account, careId, body);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  getCares(
    @CurrentAccount() account: ICurrentAccount,
    @Query() filter: GetAbsencesDto
  ) {
    return this.absenceService.getByFilter(account, filter || {});
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  getMember(
    @CurrentAccount() account: ICurrentAccount,
    @Param('id') careId: string
  ) {
    return this.absenceService.getOne(account, careId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  deleteCare(@Param('id') absenceId: string) {
    return this.absenceService.delete(absenceId);
  }

  @Get('/members/:memberId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  getMemberCares(
    @CurrentAccount() account: ICurrentAccount,
    @Param('memberId') memberId: string
  ) {
    return this.absenceService.getMemberAbsences(account, memberId);
  }

  @Get('/sunday-service-histories/members/:memberId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  getSundayServiceHistories(
    @CurrentAccount() account: ICurrentAccount,
    @Param('memberId') memberId: string
  ) {
    return this.absenceService.getSundayServiceHistories(account, memberId);
  }
}
