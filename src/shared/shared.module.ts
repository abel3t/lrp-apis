import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'shared/services/prisma.service';
import { CognitoService } from './services/cognito.service';

@Global()
@Module({
  providers: [CognitoService, PrismaService],
  imports: [],
  exports: [CognitoService, PrismaService]
})
export class SharedModule {}
