import { BadRequestException, Injectable } from '@nestjs/common';
import { ICurrentAccount } from '../../decorators/account.decorator';
import { PrismaService } from '../../shared/services/prisma.service';
import { CreateFriendDto, UpdateFriendDto } from './friend.dto';

@Injectable()
export class FriendService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    { id: accountId, organizationId }: ICurrentAccount,
    body: CreateFriendDto
  ) {
    await this.prisma.friend.create({
      data: {
        ...body,
        organization: { connect: { id: organizationId } },
        createdBy: accountId
      }
    });
  }

  getByFilter({ organizationId }: ICurrentAccount) {
    return this.prisma.friend.findMany({ where: { organizationId } });
  }

  async getOne({ organizationId }: ICurrentAccount, memberId: string) {
    const existedFriend = await this.prisma.member.findFirst({
      where: { id: memberId, organization: { id: organizationId } }
    });

    if (!existedFriend) {
      throw new BadRequestException('Friend is not found.');
    }

    return existedFriend;
  }

  async update(
    { id: accountId, organizationId }: ICurrentAccount,
    friendId: string,
    body: UpdateFriendDto
  ) {
    const existedFriend = await this.prisma.friend.findUnique({
      where: { id: friendId }
    });
    if (!existedFriend) {
      throw new BadRequestException('This friend is not found.');
    }

    await this.prisma.friend.update({
      where: { id: friendId },
      data: { ...body, updatedBy: accountId }
    });
  }

  delete() {}
}
