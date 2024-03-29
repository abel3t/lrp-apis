import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { ICurrentAccount } from '../../decorators/account.decorator';
import { CreateCareDto, GetCaresDto, UpdateCareDto } from './care.dto';
import { getToDateFilter } from '../../shared/utils/date.util';

@Injectable()
export class CareService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    { id: accountId, organizationId }: ICurrentAccount,
    body: CreateCareDto
  ) {
    const { member, ...data } = body;

    await this.prisma.care.create({
      data: {
        ...data,
        person: { connect: { id: member.id } },
        curator: { connect: { id: accountId } },
        organization: { connect: { id: organizationId } },
        createdBy: accountId
      }
    });
  }

  getByFilter(
    { organizationId }: ICurrentAccount,
    { set, search, curatorId }: GetCaresDto
  ) {
    let name;
    if (search) {
      name = {
        contains: search,
        mode: 'insensitive'
      };
    }

    return this.prisma.care.findMany({
      where: {
        organizationId,
        date: {
          lte: getToDateFilter(set)
        },
        person: {
          name
        },
        curatorId
      },
      include: { person: true, curator: true },
      orderBy: {
        date: 'desc'
      }
    });
  }

  async getOne({ organizationId }: ICurrentAccount, careId: string) {
    const existedCare = await this.prisma.care.findFirst({
      where: { id: careId, organization: { id: organizationId } },
      include: { person: true, curator: true }
    });

    if (!existedCare) {
      throw new BadRequestException('Care is not found.');
    }

    return existedCare;
  }

  async update(
    { id: accountId, organizationId }: ICurrentAccount,
    careId: string,
    body: UpdateCareDto
  ) {
    const existedCare = await this.prisma.care.findUnique({
      where: { id: careId }
    });
    if (!existedCare) {
      throw new BadRequestException('This care is not found.');
    }

    const member = body?.member?.id
      ? { connect: { id: body.member.id } }
      : undefined;

    delete body.member;

    await this.prisma.care.update({
      where: { id: careId },
      data: { ...body, person: member, updatedBy: accountId }
    });
  }

  delete() {}

  getMemberCares({ organizationId }: ICurrentAccount, memberId: string) {
    return this.prisma.care.findMany({
      where: { organizationId, personId: memberId },
      include: { person: true, curator: true },
      orderBy: {
        date: 'desc'
      }
    });
  }
}
