import { BadRequestException, Injectable } from '@nestjs/common';
import { ICurrentAccount } from '../../decorators/account.decorator';
import {
  AssignMemberForCuratorDto,
  CreateMemberDto,
  GetMembersDto,
  UpdateMemberDto
} from './dto/member.dto';
import { PrismaService } from '../../shared/services/prisma.service';
import { getVietnameseFirstName } from '../../shared/utils/string.util';
import { PersonalType } from './person.enum';
import { startOfDay } from 'date-fns';

@Injectable()
export class MemberService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    { id: accountId, organizationId }: ICurrentAccount,
    body: CreateMemberDto
  ) {
    const curator = body?.curator?.id
      ? { connect: { id: body.curator.id } }
      : undefined;
    const friend = body?.friend?.id
      ? { connect: { id: body.friend.id } }
      : undefined;

    await this.prisma.person.create({
      data: {
        ...body,
        type: PersonalType.Member,
        curator,
        friend,
        createdAt: startOfDay(new Date()),
        firstName: getVietnameseFirstName(body.name),
        organization: { connect: { id: organizationId } },
        createdBy: accountId
      }
    });
  }

  getByFilter(
    { organizationId }: ICurrentAccount,
    { curatorId, search }: GetMembersDto
  ) {
    let name;
    if (search) {
      name = {
        contains: search,
        mode: 'insensitive'
      };
    }

    return this.prisma.person.findMany({
      where: { organizationId, curatorId, name, type: PersonalType.Member },
      include: { curator: true, friend: true },
      orderBy: { firstName: 'asc' }
    });
  }

  async getOne({ organizationId }: ICurrentAccount, memberId: string) {
    const existedMember = await this.prisma.person.findFirst({
      where: { id: memberId, organization: { id: organizationId } },
      include: { curator: true, friend: true }
    });

    if (!existedMember) {
      throw new BadRequestException('Member is not found.');
    }

    return existedMember;
  }

  async update(
    { id: accountId, organizationId }: ICurrentAccount,
    memberId: string,
    body: UpdateMemberDto
  ) {
    const existedMember = await this.prisma.person.findUnique({
      where: { id: memberId }
    });
    if (!existedMember) {
      throw new BadRequestException('This member is not found.');
    }

    const firstName = body.name ? getVietnameseFirstName(body.name) : undefined;
    let curator, friend;
    if (body.curator === null) {
      curator = { disconnect: true };
    } else {
      curator = { connect: { id: body.curator.id } };
    }

    if (body.friend === null) {
      friend = { disconnect: true };
    } else {
      friend = { connect: { id: body.friend.id } };
    }

    await this.prisma.person.update({
      where: { id: memberId },
      data: { ...body, friend, curator, firstName, updatedBy: accountId }
    });
  }

  async delete(
    { id: accountId, organizationId }: ICurrentAccount,
    memberId: string
  ) {
    const existedMember = await this.prisma.person.findFirst({
      where: { id: memberId, organizationId }
    });
    if (!existedMember) {
      throw new BadRequestException('This member is not found.');
    }

    await this.prisma.person.delete({
      where: { id: memberId }
    });

    return true;
  }

  async assignMemberToCurator(
    { id: accountId, organizationId }: ICurrentAccount,
    { memberId, curatorId }: AssignMemberForCuratorDto
  ) {
    const [existedMember, existedCurator] = await Promise.all([
      this.prisma.person.findFirst({
        where: { id: memberId, organizationId }
      }),
      this.prisma.account.findFirst({
        where: { id: curatorId, organizationId }
      })
    ]);

    if (!existedMember) {
      throw new BadRequestException('This member is not found.');
    }

    if (!existedCurator) {
      throw new BadRequestException('This curator is not found.');
    }

    await this.prisma.person.update({
      where: { id: memberId },
      data: { curatorId }
    });
  }

  getFriendsOfMember({ organizationId }: ICurrentAccount, memberId: string) {
    return this.prisma.person.findMany({
      where: { organizationId, friendId: memberId },
      include: { friend: true, curator: true },
      orderBy: { firstName: 'asc' }
    });
  }
}
