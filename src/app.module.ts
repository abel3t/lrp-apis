import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AccountModule } from './core/account/account.module';
import { CareModule } from './core/care/care.module';
import { FriendModule } from './core/friend/friend.module';
import { MemberModule } from './core/member/member.module';
import { MinistryModule } from './core/ministry/ministry.module';
import { TeamModule } from './core/team/team.module';
import { JwtStrategy } from './strategies/passport.jwt.strategy';
import { OrganizationModule } from './core/organization/organization.module';
import { SharedModule } from './shared/shared.module';
import { DashboardModule } from './core/dashboard/dashboard.module';

@Module({
  imports: [
    SharedModule,
    AccountModule,
    CareModule,
    FriendModule,
    MemberModule,
    MinistryModule,
    TeamModule,
    OrganizationModule,
    DashboardModule
  ],
  controllers: [AppController],
  providers: [JwtStrategy],
  exports: []
})
export class AppModule {}
