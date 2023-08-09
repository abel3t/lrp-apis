import { BadRequestException, Injectable } from '@nestjs/common';
import { ICurrentAccount } from '../../decorators/account.decorator';
import { PrismaService } from '../../shared/services/prisma.service';
import { CreateFriendDto, UpdateFriendDto } from './dto/friend.dto';
import { PersonalType } from './person.enum';
import { getVietnameseFirstName } from '../../shared/utils/string.util';

@Injectable()
export class FriendService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    { id: accountId, organizationId }: ICurrentAccount,
    body: CreateFriendDto
  ) {
    await this.prisma.person.create({
      data: {
        ...body,
        firstName: getVietnameseFirstName(body.name),
        organization: { connect: { id: organizationId } },
        createdBy: accountId
      }
    });
  }

  getByFilter({ organizationId }: ICurrentAccount) {
    return this.prisma.person.findMany({
      where: { organizationId, type: { notIn: [PersonalType.Member] } }
    });
  }

  async getOne({ organizationId }: ICurrentAccount, friendId: string) {
    const existedFriend = await this.prisma.person.findFirst({
      where: { id: friendId, organization: { id: organizationId } }
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
    const existedFriend = await this.prisma.person.findUnique({
      where: { id: friendId }
    });
    if (!existedFriend) {
      throw new BadRequestException('This friend is not found.');
    }

    await this.prisma.person.update({
      where: { id: friendId },
      data: { ...body, updatedBy: accountId }
    });
  }

  async delete(
    { id: accountId, organizationId }: ICurrentAccount,
    friendId: string
  ) {
    const existedFriend = await this.prisma.person.findFirst({
      where: { id: friendId, organizationId }
    });
    if (!existedFriend) {
      throw new BadRequestException('This friend is not found.');
    }

    await this.prisma.person.delete({
      where: { id: friendId }
    });

    return true;
  }
}
