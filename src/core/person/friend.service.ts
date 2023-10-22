import { BadRequestException, Injectable } from '@nestjs/common';
import { ICurrentAccount } from '../../decorators/account.decorator';
import { PrismaService } from '../../shared/services/prisma.service';
import { CreateFriendDto, GetFriendsDto, UpdateFriendDto } from './dto/friend.dto';
import { PersonalType } from './person.enum';
import { getVietnameseFirstName } from '../../shared/utils/string.util';

@Injectable()
export class FriendService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    { id: accountId, organizationId }: ICurrentAccount,
    body: CreateFriendDto
  ) {
    const friend = body?.friend?.id
      ? { connect: { id: body.friend.id } }
      : undefined;

    await this.prisma.person.create({
      data: {
        ...body,
        friend,
        firstName: getVietnameseFirstName(body.name),
        organization: { connect: { id: organizationId } },
        createdBy: accountId
      }
    });
  }

  getByFilter(
    { organizationId }: ICurrentAccount,
    { curatorId, search }: GetFriendsDto
  ) {
    let name;
    if (search) {
      name = {
        contains: search,
        mode: 'insensitive'
      };
    }

    return this.prisma.person.findMany({
      where: {
        organizationId,
        curatorId,
        name,
        type: { notIn: [PersonalType.Member] }
      },
      include: { curator: true, friend: true },
      orderBy: { firstName: 'asc' }
    });
  }

  async getOne({ organizationId }: ICurrentAccount, friendId: string) {
    const existedFriend = await this.prisma.person.findFirst({
      where: { id: friendId, organization: { id: organizationId } },
      include: { friend: true }
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

    let friend;
    if (body.friend === null) {
      friend = { disconnect: true };
    } else {
      friend = { connect: { id: body.friend.id } };
    }

    await this.prisma.person.update({
      where: { id: friendId },
      data: { ...body, friend, updatedBy: accountId }
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
