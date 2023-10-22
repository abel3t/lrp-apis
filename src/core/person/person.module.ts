import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { MemberController } from './member.controller';
import { FriendService } from './friend.service';
import { MemberService } from './member.service';
import { PeopleService } from './personal.service';
import { PeopleController } from './person.controller';
@Module({
  imports: [],
  controllers: [FriendController, MemberController, PeopleController],
  providers: [FriendService, MemberService, PeopleService]
})
export class PersonModule {}
