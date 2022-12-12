import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'shared/services/prisma.service';
import { ICurrentAccount } from 'decorators/account.decorator';
import { CreateMinistryDto, UpdateMinistryDto } from './ministry.dto';

@Injectable()
export class MinistryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    { id: accountId, organizationId }: ICurrentAccount,
    body: CreateMinistryDto
  ) {
    await this.prisma.ministry.create({
      data: {
        ...body,
        organization: { connect: { id: organizationId } },
        createdBy: accountId
      }
    });
  }

  getByFilter({ organizationId }: ICurrentAccount) {
    return this.prisma.ministry.findMany({ where: { organizationId } });
  }

  getOne() {}

  async update(
    { id: accountId, organizationId }: ICurrentAccount,
    ministryId: string,
    body: UpdateMinistryDto
  ) {
    const existedMinistry = await this.prisma.ministry.findUnique({
      where: { id: ministryId }
    });
    if (!existedMinistry) {
      throw new BadRequestException('This ministry is not found.');
    }

    await this.prisma.ministry.update({
      where: { id: ministryId },
      data: { ...body, updatedBy: accountId }
    });
  }

  delete() {}

  getMembers() {}

  addMember() {}

  removeMember() {}
}
