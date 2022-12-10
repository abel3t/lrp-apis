import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { CognitoService } from '../../shared/services/cognito.service';

@Module({
  imports: [],
  controllers: [AccountController],
  providers: [AccountService, CognitoService]
})
export class AccountModule {}
