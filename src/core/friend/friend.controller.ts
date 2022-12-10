import { Controller, Get } from '@nestjs/common';
import { FriendService } from './friend.service';

@Controller()
export class FriendController {
  constructor(private readonly accountService: FriendService) {}

  @Get('/friend')
  getFriend(): string {
    return this.accountService.getFriend();
  }
}
