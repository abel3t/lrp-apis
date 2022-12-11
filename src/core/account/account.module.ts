import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { CognitoService } from '../../shared/services/cognito.service';
import { PrismaService } from '../../shared/services/prisma.service';

@Module({
  imports: [],
  controllers: [AccountController],
  providers: [AccountService, CognitoService, PrismaService]
})
export class AccountModule {}
