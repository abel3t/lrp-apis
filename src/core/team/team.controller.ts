import { Controller, Get } from '@nestjs/common';
import { TeamService } from './team.service';

@Controller()
export class TeamController {
  constructor(private readonly accountService: TeamService) {}

  @Get('/team')
  getTeam(): string {
    return this.accountService.getTeam();
  }
}
