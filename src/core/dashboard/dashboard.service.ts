import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { CarePriority } from '../care/care.enum';
import { arraySortBy } from '../../shared/utils/array.util';
import { TopCaringTitle } from './dashboard.enum';
import { ICurrentAccount } from '../../decorators/account.decorator';
import {
  NeedingMoreCareDto,
  OverviewDto,
  TopCaringPeopleDto
} from './dashboard.dto';
import {
  getFromDateFilter,
  getToDateFilter
} from '../../shared/utils/date.util';
import { PersonalType } from '../person/person.enum';

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
