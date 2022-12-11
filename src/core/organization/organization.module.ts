import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { PrismaService } from 'shared/services/prisma.service';
import { CognitoService } from '../../shared/services/cognito.service';

@Module({
  imports: [],
  controllers: [OrganizationController],
  providers: [OrganizationService, PrismaService, CognitoService]
})
export class OrganizationModule {}
