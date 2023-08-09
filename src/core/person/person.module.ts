import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { MemberController } from './member.controller';
import { FriendService } from './friend.service';
import { MemberService } from './member.service';
@Module({
  imports: [],
  controllers: [FriendController, MemberController],
  providers: [FriendService, MemberService]
})
export class PersonModule {}
