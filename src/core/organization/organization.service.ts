import { BadRequestException, Injectable, Param } from '@nestjs/common';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto
} from './organization.dto';
import { PrismaService } from '../../shared/services/prisma.service';
import { ICurrentAccount } from '../../decorators/account.decorator';

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  private async checkExistedOrganizationName(name: string, selfId?: string) {
    const selfCondition: any = {};
    if (selfId) {
      selfCondition.NOT = { id: selfId };
    }

    const existedOrgName = await this.prisma.organization.findFirst({
      where: { name, ...selfCondition }
    });
    if (existedOrgName) {
      throw new BadRequestException('This organization is already exists.');
    }
  }

  async create({ id }: ICurrentAccount, { name }: CreateOrganizationDto) {
    await this.checkExistedOrganizationName(name);

    await this.prisma.organization.create({
      data: {
        name,
        createdBy: id
      }
    });
  }

  async update(
    { id: accountId }: ICurrentAccount,
    { id, name }: UpdateOrganizationDto
  ) {
    if (!name) {
      return;
    }

    const existedOrg = await this.prisma.organization.findFirst({
      where: { id }
    });
    if (!existedOrg) {
      throw new BadRequestException('This organization is not exists.');
    }

    await this.checkExistedOrganizationName(name, id);

    await this.prisma.organization.update({
      where: { id },
      data: {
        name,
        updatedBy: accountId
      }
    });
  }

  getByFilter() {
    return this.prisma.organization.findMany();
  }

  getOne() {}

  getAdmins(organizationId: string) {
    return this.prisma.account.findMany({ where: { organizationId } });
  }

  addAdmin() {}

  deleteAdmin() {}
}
