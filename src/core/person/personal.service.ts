import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { ICurrentAccount } from '../../decorators/account.decorator';

@Injectable()
export class PeopleService {
  constructor(private readonly prisma: PrismaService) {}

  getByFilter({ organizationId }: ICurrentAccount) {
    return this.prisma.person.findMany({
      where: { organizationId }
    });
  }

  async getOne({ organizationId }: ICurrentAccount, memberId: string) {
    const existedMember = await this.prisma.person.findFirst({
      where: { id: memberId, organization: { id: organizationId } },
      include: { curator: true }
    });

    if (!existedMember) {
      throw new BadRequestException('Member is not found.');
    }

    return existedMember;
  }
}
