import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AccountModule } from './core/account/account.module';
import { AdminModule } from './core/admin/admin.module';
import { CareModule } from './core/care/care.module';
import { FriendModule } from './core/friend/friend.module';
import { MemberModule } from './core/member/member.module';
import { MinistryModule } from './core/ministry/ministry.module';
import { TeamModule } from './core/team/team.module';

@Module({
  imports: [
    AccountModule,
    AdminModule,
    CareModule,
    FriendModule,
    MemberModule,
    MinistryModule,
    TeamModule
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
