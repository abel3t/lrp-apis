import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

@Module({
  imports: [],
  controllers: [OrganizationController],
  providers: [OrganizationService]
})
export class OrganizationModule {}
