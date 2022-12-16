import { BadRequestException, Injectable } from '@nestjs/common';
import { ICurrentAccount } from '../../decorators/account.decorator';
import {
  AssignMemberForCuratorDto,
  CreateMemberDto,
  GetMembersDto,
  UpdateMemberDto
} from './member.dto';
import { PrismaService } from '../../shared/services/prisma.service';
import { getVietnameseFirstName } from '../../shared/utils/string.util';

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

    await this.prisma.member.create({
      data: {
        ...body,
        curator,
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

    return this.prisma.member.findMany({
      where: { organizationId, curatorId, name },
      include: { curator: true },
      orderBy: { firstName: 'asc' }
    });
  }

  async getOne({ organizationId }: ICurrentAccount, memberId: string) {
    const existedMember = await this.prisma.member.findFirst({
      where: { id: memberId, organization: { id: organizationId } },
      include: { curator: true }
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
    const existedMember = await this.prisma.member.findUnique({
      where: { id: memberId }
    });
    if (!existedMember) {
      throw new BadRequestException('This member is not found.');
    }

    const firstName = body.name ? getVietnameseFirstName(body.name) : undefined;
    let curator;
    if (body.curator === null) {
      curator = { disconnect: true };
    }
    if (body.curator?.id) {
      curator = { connect: { id: body.curator.id } };
    }

    await this.prisma.member.update({
      where: { id: memberId },
      data: { ...body, curator, firstName, updatedBy: accountId }
    });
  }

  delete() {}

  async assignMemberToCurator(
    { id: accountId, organizationId }: ICurrentAccount,
    { memberId, curatorId }: AssignMemberForCuratorDto
  ) {
    const [existedMember, existedCurator] = await Promise.all([
      this.prisma.member.findFirst({
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

    await this.prisma.member.update({
      where: { id: memberId },
      data: { curatorId }
    });
  }
}
