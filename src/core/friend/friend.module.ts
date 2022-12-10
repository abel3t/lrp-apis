import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';

@Module({
  imports: [],
  controllers: [FriendController],
  providers: [FriendService]
})
export class FriendModule {}
