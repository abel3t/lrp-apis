import { BadRequestException, Injectable } from '@nestjs/common';
import { ICurrentAccount } from '../../decorators/account.decorator';
import { CreateMemberDto, UpdateMemberDto } from './member.dto';
import { PrismaService } from '../../shared/services/prisma.service';

@Injectable()
export class MemberService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    { id: accountId, organizationId }: ICurrentAccount,
    body: CreateMemberDto
  ) {
    await this.prisma.member.create({
      data: {
        ...body,
        organization: { connect: { id: organizationId } },
        createdBy: accountId
      }
    });
  }

  getByFilter({ organizationId }: ICurrentAccount) {
    return this.prisma.member.findMany({ where: { organizationId } });
  }

  getOne() {}

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

    await this.prisma.member.update({
      where: { id: memberId },
      data: { ...body, updatedBy: accountId }
    });
  }

  delete() {}
}
