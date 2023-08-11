import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { ICurrentAccount } from '../../decorators/account.decorator';
import { getToDateFilter } from '../../shared/utils/date.util';
import {
  CreateAbsenceDto,
  GetAbsencesDto,
  UpdateAbsenceDto
} from './absence.dto';
import { startOfDay } from 'date-fns';

@Injectable()
export class AbsenceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    { id: accountId, organizationId }: ICurrentAccount,
    body: CreateAbsenceDto
  ) {
    const { member, ...data } = body;

    await this.prisma.absence.create({
      data: {
        ...data,
        date: startOfDay(new Date(data.date) || new Date()),
        person: { connect: { id: member.id } },
        curator: { connect: { id: accountId } },
        organization: { connect: { id: organizationId } },
        createdBy: accountId
      }
    });
  }

  getByFilter(
    { organizationId }: ICurrentAccount,
    { set, search, curatorId }: GetAbsencesDto
  ) {
    let name;
    if (search) {
      name = {
        contains: search,
        mode: 'insensitive'
      };
    }

    return this.prisma.absence.findMany({
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

  async getOne({ organizationId }: ICurrentAccount, absenceId: string) {
    const existedAbsence = await this.prisma.absence.findFirst({
      where: { id: absenceId, organization: { id: organizationId } },
      include: { person: true, curator: true }
    });

    if (!existedAbsence) {
      throw new BadRequestException('Absence is not found.');
    }

    return existedAbsence;
  }

  async update(
    { id: accountId }: ICurrentAccount,
    absenceId: string,
    body: UpdateAbsenceDto
  ) {
    const existedAbsence = await this.prisma.absence.findUnique({
      where: { id: absenceId }
    });
    if (!existedAbsence) {
      throw new BadRequestException('This absence is not found.');
    }

    const member = body?.member?.id
      ? { connect: { id: body.member.id } }
      : undefined;

    await this.prisma.absence.update({
      where: { id: absenceId },
      data: { ...body, person: member, updatedBy: accountId }
    });
  }

  delete(absenceId: string) {
    return this.prisma.absence.delete({ where: { id: absenceId } });
  }

  getMemberAbsences({ organizationId }: ICurrentAccount, memberId: string) {
    return this.prisma.absence.findMany({
      where: { organizationId, personId: memberId },
      include: { person: true, curator: true },
      orderBy: {
        date: 'desc'
      }
    });
  }
}
