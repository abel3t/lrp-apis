import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { ICurrentAccount } from '../../decorators/account.decorator';
import {
  CreateDiscipleDto,
  GetDisciplesDto,
  UpdateDiscipleDto
} from './disciple.dto';
import { getToDateFilter } from '../../shared/utils/date.util';

@Injectable()
export class DiscipleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    { id: accountId, organizationId }: ICurrentAccount,
    body: CreateDiscipleDto
  ) {
    const { person, ...data } = body;

    await this.prisma.disciple.create({
      data: {
        ...data,
        person: { connect: { id: person.id } },
        curator: { connect: { id: accountId } },
        organization: { connect: { id: organizationId } },
        createdBy: accountId
      }
    });
  }

  getByFilter(
    { organizationId }: ICurrentAccount,
    { set, search, curatorId }: GetDisciplesDto
  ) {
    let name;
    if (search) {
      name = {
        contains: search,
        mode: 'insensitive'
      };
    }

    return this.prisma.disciple.findMany({
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

  async getOne({ organizationId }: ICurrentAccount, discipleId: string) {
    const existedDisciple = await this.prisma.disciple.findFirst({
      where: { id: discipleId, organization: { id: organizationId } },
      include: { person: true, curator: true }
    });

    if (!existedDisciple) {
      throw new BadRequestException('Disciple is not found.');
    }

    return existedDisciple;
  }

  async update(
    { id: accountId, organizationId }: ICurrentAccount,
    discipleId: string,
    body: UpdateDiscipleDto
  ) {
    const existedDisciple = await this.prisma.disciple.findUnique({
      where: { id: discipleId }
    });
    if (!existedDisciple) {
      throw new BadRequestException('This disciple is not found.');
    }

    const person = body?.person?.id
      ? { connect: { id: body.person.id } }
      : undefined;

    await this.prisma.disciple.update({
      where: { id: discipleId },
      data: { ...body, person, updatedBy: accountId }
    });
  }

  delete() {}

  getPersonDisciples({ organizationId }: ICurrentAccount, memberId: string) {
    return this.prisma.disciple.findMany({
      where: { organizationId, personId: memberId },
      include: { person: true, curator: true },
      orderBy: {
        date: 'desc'
      }
    });
  }
}
