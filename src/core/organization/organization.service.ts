import { BadRequestException, Injectable, Param } from '@nestjs/common';
import {
  CreateOrganizationAdminDto,
  CreateOrganizationDto,
  UpdateOrganizationDto
} from './organization.dto';
import { PrismaService } from 'shared/services/prisma.service';
import { ICurrentAccount } from 'decorators/account.decorator';
import { CognitoService } from 'shared/services/cognito.service';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly cognitoService: CognitoService,
    private readonly prisma: PrismaService
  ) {}

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

  getOne(id: string) {
    return this.prisma.organization.findUnique({ where: { id } });
  }

  getAdmins(organizationId: string) {
    return this.prisma.account.findMany({ where: { organizationId } });
  }

  async addAdmin(
    { id: accountId }: ICurrentAccount,
    organizationId: string,
    body: CreateOrganizationAdminDto
  ) {
    const [existedAccount, existedOrganization] = await Promise.all([
      this.prisma.account.findUnique({
        where: { username: body.username.toLowerCase() }
      }),
      this.prisma.organization.findUnique({
        where: { id: organizationId }
      })
    ]);

    if (existedAccount) {
      throw new BadRequestException('This username is taken.');
    }

    if (!existedOrganization) {
      throw new BadRequestException('Organization is not found.');
    }

    return this.cognitoService
      .signUp({
        ...body,
        organizationId
      })
      .then(async () => {
        const newUser = await this.prisma.account.create({
          data: {
            username: body.username.toLowerCase(),
            role: body.role,
            name: body.name,
            organization: { connect: { id: organizationId } }
          }
        });

        await this.cognitoService.updateUserCognitoAttributes(
          body.username.toLowerCase(),
          [
            new CognitoUserAttribute({
              Name: 'custom:id',
              Value: newUser.id
            })
          ]
        );
      })
      .catch((error) => {
        throw new BadRequestException(error, 'addAdmin');
      });
  }

  deleteAdmin() {}
}
