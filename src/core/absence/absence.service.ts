import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { ICurrentAccount } from '../../decorators/account.decorator';
import {
  createStartOfDate,
  getToDateFilter
} from '../../shared/utils/date.util';
import {
  CreateAbsenceDto,
  GetAbsencesDto,
  UpdateAbsenceDto
} from './absence.dto';
import {
  eachDayOfInterval,
  format,
  isSunday,
  startOfWeek,
  subWeeks
} from 'date-fns';
import { PersonalType } from '../person/person.enum';

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

    const { member: _, ...data } = body;

    let person: Record<string, any>;
    if (body.member === null) {
      person = { disconnect: true };
    } else {
      person = { connect: { id: body.member.id } };
    }

    await this.prisma.absence.update({
      where: { id: absenceId },
      data: { ...data, person, updatedBy: accountId }
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

  async getSundayServiceHistories(
    { organizationId }: ICurrentAccount,
    memberId: string
  ) {
    const DATE_FORMAT = 'dd/MM/yyyy';
    const utcOffset = 420;

    const [member, absences] = await Promise.all([
      this.prisma.person.findFirst({
        where: {
          id: memberId,
          organizationId,
          type: PersonalType.Member
        }
      }),
      this.prisma.absence.findMany({
        where: {
          organizationId
        }
      })
    ]);

    if (!member) {
      throw new BadRequestException('Member is not found.');
    }

    const groupedAbsences: Record<string, any> = {};
    absences?.forEach((absence) => {
      if (!groupedAbsences[format(startOfWeek(absence.date), DATE_FORMAT)]) {
        groupedAbsences[format(startOfWeek(absence.date), DATE_FORMAT)] = [];
      }

      groupedAbsences[format(startOfWeek(absence.date), DATE_FORMAT)].push(
        absence
      );
    });

    const week = startOfWeek(createStartOfDate(utcOffset));
    const pastWeek = subWeeks(week, 52);
    const histories = [];

    eachDayOfInterval({
      start: pastWeek,
      end: createStartOfDate(utcOffset)
    }).map((date) => {
      if (!isSunday(date)) {
        return;
      }

      if (groupedAbsences[format(date, DATE_FORMAT)]?.length) {
        const absence = groupedAbsences[format(date, DATE_FORMAT)]?.[0];

        histories.push({
          date,
          status: 'absent',
          type: absence.type,
          description: absence.description
        });
        return;
      }

      histories.push({
        date,
        status: 'present',
        description: 'Good!'
      });
    });

    return histories.reverse();
  }
}
