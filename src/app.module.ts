import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AccountModule } from './core/account/account.module';
import { CareModule } from './core/care/care.module';
import { JwtStrategy } from './strategies/passport.jwt.strategy';
import { OrganizationModule } from './core/organization/organization.module';
import { SharedModule } from './shared/shared.module';
import { DashboardModule } from './core/dashboard/dashboard.module';
import { S3Service } from './shared/services/s3.service';
import { PersonModule } from './core/person/person.module';
import { AbsenceModule } from './core/absence/absence.module';

@Module({
  imports: [
    SharedModule,
    AccountModule,
    CareModule,
    PersonModule,
    OrganizationModule,
    DashboardModule,
    AbsenceModule
  ],
  controllers: [AppController],
  providers: [JwtStrategy, S3Service],
  exports: []
})
export class AppModule {}
