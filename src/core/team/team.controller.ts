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
import { TeamService } from './team.service';
import { AuthGuard } from 'guards/auth.guard';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from 'decorators/roles.decorator';
import { Role } from '../account/account.enum';
import { CurrentAccount, ICurrentAccount } from 'decorators/account.decorator';
import { CreateTeamDto, UpdateTeamDto } from './team.dto';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  createTeam(
    @CurrentAccount() account: ICurrentAccount,
    @Body() body: CreateTeamDto
  ) {
    return this.teamService.create(account, body);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  updateTeam(
    @CurrentAccount() account: ICurrentAccount,
    @Body() body: UpdateTeamDto,
    @Param('id') teamId: string
  ) {
    return this.teamService.update(account, teamId, body);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  getTeams(@CurrentAccount() account: ICurrentAccount) {
    return this.teamService.getByFilter(account);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  getMember(
    @CurrentAccount() account: ICurrentAccount,
    @Param('id') teamId: string
  ) {
    return this.teamService.getOne(account, teamId);
  }


  @Delete(':id')
  deleteTeam() {
    return this.teamService.delete();
  }

  @Get(':id/members')
  getMembers() {
    return this.teamService.getMembers();
  }

  @Post(':id/members')
  addMember() {
    return this.teamService.addMember();
  }

  @Delete(':teamId/members/:memberId')
  removeMember() {
    return this.teamService.removeMember();
  }
}
