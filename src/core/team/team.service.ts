import { Injectable } from '@nestjs/common';

@Injectable()
export class TeamService {
  getTeam(): string {
    return 'Hello Team!';
  }
}
