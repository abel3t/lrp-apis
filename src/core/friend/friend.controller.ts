import { Controller, Delete, Get, Post } from '@nestjs/common';
import { FriendService } from './friend.service';

@Controller('friends')
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

  @Get(':id')
  getFriend() {
    return this.friendService.getOne();
  }

  @Delete(':id')
  deleteFriend() {
    return this.friendService.delete();
  }
}
