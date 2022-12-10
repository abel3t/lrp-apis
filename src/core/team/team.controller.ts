import { Controller, Delete, Get, Post } from '@nestjs/common';
import { TeamService } from './team.service';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  createTeam() {
    return this.teamService.create();
  }

  @Get()
  getTeams() {
    return this.teamService.getByFilter();
  }


  @Get(':id')
  getTeam() {
    return this.teamService.getOne();
  }

  @Post(':id')
  updateTeam() {
    return this.teamService.update();
  }

  @Post(':id')
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
