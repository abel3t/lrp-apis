import {
  BadRequestException,
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import { CognitoService } from 'shared/services/cognito.service';
import { AppConfig } from 'shared/config';
import { Role } from './account.enum';
import { PrismaService } from 'shared/services/prisma.service';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { RefreshTokenDto } from './account.dto';
import { ICurrentAccount } from '../../decorators/account.decorator';

@Injectable()
export class AccountService {
  constructor(
    private readonly cognitoService: CognitoService,
    private readonly prisma: PrismaService
  ) {}

  createGlobalAdmin({ username, password, secretKey }) {
    const appSecretKey = AppConfig.APP.CREATE_ACCOUNT_SECRET_KEY;
    if (secretKey !== appSecretKey) {
      throw new ForbiddenException(
        'You can not access this API.',
        'createGlobalAdmin'
      );
    }

    return this.cognitoService
      .signUp({
        username: username.toLowerCase(),
        password,
        role: Role.Global_Admin
      })
      .then(async () => {
        const newUser = await this.prisma.account.create({
          data: {
            username: username.toLowerCase(),
            role: Role.Global_Admin
          }
        });

        await this.cognitoService.updateUserCognitoAttributes(
          username.toLowerCase(),
          [
            new CognitoUserAttribute({
              Name: 'custom:id',
              Value: newUser.id
            })
          ]
        );
      })
      .catch((error) => {
        throw new BadRequestException(error, 'createGlobalAdmin');
      });
  }

  login({ username, password }) {
    return this.cognitoService
      .signIn(username.toLowerCase(), password)
      .then(async (data) => {
        const account = await this.prisma.account.findUnique({
          where: { username: username.toLowerCase() },
          select: {
            id: true,
            username: true,
            role: true
          }
        });

        if (!account) {
          throw new BadRequestException('Username or Password is invalid.');
        }

        return {
          accessToken: data,
          user: account
        };
      })
      .catch((error) => {
        throw new BadRequestException(error, 'refreshToken');
      });
  }

  refreshToken({ username, refreshToken }: RefreshTokenDto) {
    return this.cognitoService
      .refreshToken(username, refreshToken)
      .then(async (data) => {
        const account = await this.prisma.account.findUnique({
          where: { username },
          select: {
            id: true,
            username: true,
            role: true
          }
        });

        if (!account) {
          throw new BadRequestException('Username or Password is invalid.');
        }

        return {
          accessToken: data,
          user: account
        };
      })
      .catch((error) => {
        throw new BadRequestException(error, 'refreshToken');
      });
  }

  async getAccount(username: string) {
    return this.prisma.account.findFirst({ where: { username } });
  }

  getCurators({ organizationId }: ICurrentAccount) {
    return this.prisma.account.findMany({ where: { organizationId } });
  }
}
