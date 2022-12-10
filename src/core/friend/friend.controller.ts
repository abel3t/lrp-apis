import { Controller, Delete, Get, Post } from '@nestjs/common';
import { FriendService } from './friend.service';

@Controller()
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Post()
  createFriend() {
    return this.friendService.create();
  }

  @Get()
  getFriends() {
    return this.friendService.getByFilter();
  }

  @Get()
  getFriend() {
    return this.friendService.getOne();
  }

  @Delete()
  deleteFriend() {
    return this.friendService.delete();
  }
}
