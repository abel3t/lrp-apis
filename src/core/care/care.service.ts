import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { ICurrentAccount } from '../../decorators/account.decorator';
import { CreateCareDto, UpdateCareDto } from './care.dto';

@Injectable()
export class CareService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    { id: accountId, organizationId }: ICurrentAccount,
    body: CreateCareDto
  ) {
    await this.prisma.care.create({
      data: {
        ...body,
        member: { connect: { id: body.member.id } },
        curator: { connect: { id: accountId } },
        organization: { connect: { id: organizationId } },
        createdBy: accountId
      }
    });
  }

  getByFilter({ organizationId }: ICurrentAccount) {
    return this.prisma.care.findMany({
      where: { organizationId },
      include: { member: true, curator: true }
    });
  }

  async getOne({ organizationId }: ICurrentAccount, careId: string) {
    const existedCare = await this.prisma.care.findFirst({
      where: { id: careId, organization: { id: organizationId } }
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

    await this.prisma.care.update({
      where: { id: careId },
      data: { ...body, member, updatedBy: accountId }
    });
  }

  delete() {}
}
