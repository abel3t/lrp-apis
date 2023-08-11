import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { CarePriority } from '../care/care.enum';
import { arraySortBy } from '../../shared/utils/array.util';
import { PresentReportType, TopCaringTitle } from './dashboard.enum';
import { ICurrentAccount } from '../../decorators/account.decorator';
import {
  NeedingMoreCareDto,
  OverviewDto,
  PresentDto,
  TopCaringPeopleDto
} from './dashboard.dto';
import {
  getFromDateFilter,
  getToDateFilter
} from '../../shared/utils/date.util';
import { PersonalType } from '../person/person.enum';
import { eachDayOfInterval, format, startOfDay, startOfWeek, subMinutes, subWeeks } from 'date-fns';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview({ organizationId }: ICurrentAccount, { set }: OverviewDto) {
    const people = await this.prisma.person.findMany({
      where: {
        organizationId,
        createdAt: {
          lte: getToDateFilter(set)
        }
      },
      select: { id: true, type: true, createdAt: true }
    });

    let totalMembers = 0;
    let totalFriends = 0;
    let totalUnbelievers = 0;

    people.forEach((person) => {
      if (person.type === PersonalType.Member) {
        ++totalMembers;
        return;
      }

      if (person.type === PersonalType.Unbeliever) {
        ++totalUnbelievers;
      } else {
        ++totalFriends;
      }
    });

    return {
      totalMembers,
      totalFriends,
      totalUnbelievers,
      totalPeople: people.length
    };
  }

  async getNeedingMoreCareMembers(
    { organizationId }: ICurrentAccount,
    { set }: NeedingMoreCareDto
  ) {
    const cares = await this.prisma.care.findMany({
      where: {
        organizationId,
        priority: { in: [CarePriority.Normal, CarePriority.Warning] },
        date: {
          lte: getToDateFilter(set),
          gte: getFromDateFilter(set)
        }
      },
      include: { person: true, curator: true }
    });

    const warningCares = [];
    const normalCares = [];
    cares.forEach((care) => {
      if (care.priority === CarePriority.Warning) {
        warningCares.push(care);
      }

      if (care.priority === CarePriority.Normal) {
        normalCares.push(care);
      }
    });

    const sortedWarningCares = arraySortBy(warningCares, 'date', 'desc');
    const sortedNormalCares = arraySortBy(normalCares, 'date', 'desc');

    return sortedWarningCares.concat(sortedNormalCares);
  }

  async getTopCaringPeople(
    { organizationId }: ICurrentAccount,
    { set }: TopCaringPeopleDto
  ) {
    const [accounts, cares] = await Promise.all([
      this.prisma.account.findMany({ where: { organizationId } }),
      this.prisma.care.findMany({
        where: {
          organizationId,
          date: {
            lte: getToDateFilter(set),
            gte: getFromDateFilter(set)
          }
        }
      })
    ]);

    const accountsMap: Record<string, any> = {};
    accounts?.forEach((account) => {
      accountsMap[account.id] = {
        ...account,
        careTimes: 0
      };
    });

    cares.forEach((care) => {
      if (accountsMap[care.curatorId]) {
        ++accountsMap[care.curatorId].careTimes;
      }
    });

    const sortedAccountByCareTimes = arraySortBy(
      Object.values(accountsMap),
      'careTimes',
      'desc'
    );
    return sortedAccountByCareTimes.map((care, index) => {
      return {
        ...care,
        title: getTitleByCareTimes(care.careTimes, index)
      };
    });
  }

  async getPresents(
    { organizationId }: ICurrentAccount,
    { type, amount }: PresentDto
  ) {
    const DATE_FORMAT = 'dd/MM/yyyy';

    const [members, absences] = await Promise.all([
      this.prisma.person.findMany({
        where: {
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

    const groupedMembers: Record<string, any> = {};
    const groupedAbsences: Record<string, any> = {};
    members?.forEach((member) => {
      if (!groupedMembers[format(member.createdAt, DATE_FORMAT)]) {
        groupedMembers[format(member.createdAt, DATE_FORMAT)] = [];
      }

      groupedMembers[format(member.createdAt, DATE_FORMAT)].push(member);
    });

    absences?.forEach((absence) => {
      if (!groupedAbsences[format(absence.date, DATE_FORMAT)]) {
        groupedAbsences[format(absence.date, DATE_FORMAT)] = [];
      }

      groupedAbsences[format(absence.date, DATE_FORMAT)].push(absence);
    });

    const historiesMap: Record<string, any> = {};
    if (type === PresentReportType.Week) {
      const week = startOfWeek(new Date());
      const pastWeek = subWeeks(week, amount - 1);

      const coordinateMember = await this.prisma.person.findMany({
        where: {
          organizationId,
          createdAt: {
            lt: pastWeek
          }
        }
      });

      eachDayOfInterval({
        start: pastWeek,
        end: new Date()
      }).map((date) => {
        if (!historiesMap[format(startOfWeek(date), DATE_FORMAT)]) {
          historiesMap[format(startOfWeek(date), DATE_FORMAT)] = [];
        }
        console.log('date', format(date, DATE_FORMAT));
        console.log('group', groupedMembers[format(date, DATE_FORMAT)] );

        historiesMap[format(startOfWeek(date), DATE_FORMAT)].push({
          member: groupedMembers[format(date, DATE_FORMAT)] || {},
          absence: groupedAbsences[format(date, DATE_FORMAT)] || {}
        });
      });
      return { coordinateMember, historiesMap };

    }

  }
}

const getTitleByCareTimes = (careTimes = 0, index: number) => {
  if (!careTimes) {
    return TopCaringTitle.NotGood;
  }

  const EXCELLENT_AMOUNT_INDEX = 2;
  const GOOD_AMOUNT_INDEX = EXCELLENT_AMOUNT_INDEX + 2;

  const ExcellentCondition = 5;
  const GoodCondition = 3;

  if (careTimes > ExcellentCondition && index < EXCELLENT_AMOUNT_INDEX) {
    return TopCaringTitle.Excellent;
  }

  if (careTimes > GoodCondition && index < GOOD_AMOUNT_INDEX) {
    return TopCaringTitle.Good;
  }

  return TopCaringTitle.Normal;
};
