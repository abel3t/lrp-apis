import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'shared/services/prisma.service';
import { ICurrentAccount } from 'decorators/account.decorator';
import { CreateTeamDto, UpdateTeamDto } from './team.dto';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    { id: accountId, organizationId }: ICurrentAccount,
    body: CreateTeamDto
  ) {
    await this.prisma.team.create({
      data: {
        ...body,
        organization: { connect: { id: organizationId } },
        createdBy: accountId
      }
    });
  }

  getByFilter({ organizationId }: ICurrentAccount) {
    return this.prisma.team.findMany({ where: { organizationId } });
  }

  async getOne({ organizationId }: ICurrentAccount, memberId: string) {
    const existedTeam = await this.prisma.member.findFirst({ where: { id: memberId, organization: { id: organizationId }}});

    if (!existedTeam) {
      throw new BadRequestException('Team is not found.');
    }

    return existedTeam;
  }

  async update(
    { id: accountId, organizationId }: ICurrentAccount,
    teamId: string,
    body: UpdateTeamDto
  ) {
    const existedTeam = await this.prisma.team.findUnique({
      where: { id: teamId }
    });
    if (!existedTeam) {
      throw new BadRequestException('This team is not found.');
    }

    await this.prisma.team.update({
      where: { id: teamId },
      data: { ...body, updatedBy: accountId }
    });
  }

  delete() {}

  getMembers() {}

  addMember() {}

  removeMember() {}
}
