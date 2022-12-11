import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { PrismaService } from 'shared/services/prisma.service';

@Module({
  imports: [],
  controllers: [FriendController],
  providers: [FriendService, PrismaService]
})
export class FriendModule {}
