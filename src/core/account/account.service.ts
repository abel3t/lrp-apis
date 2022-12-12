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
        username,
        password,
        role: Role.Global_Admin
      })
      .then(async () => {
        const newUser = await this.prisma.account.create({
          data: {
            username,
            role: Role.Global_Admin
          }
        });

        await this.cognitoService.updateUserCognitoAttributes(username, [
          new CognitoUserAttribute({
            Name: 'custom:id',
            Value: newUser.id
          })
        ]);
      })
      .catch((error) => {
        throw new BadRequestException(error, 'createGlobalAdmin');
      });
  }

  login({ username, password }) {
    return this.cognitoService.signIn(username, password)
      .then(async (data) => {
        const account = await this.prisma.account.findUnique({ where: { username }});

        if (!account) {
          throw new BadRequestException('Username or Password is invalid.')
        }

        return {
          accessToken: data,
          userData: account
        }
      })
      .catch(error => {
        throw new BadRequestException(error, 'refreshToken')
      });
  }

  refreshToken({ username, refreshToken }: RefreshTokenDto) {
    return this.cognitoService.refreshToken(username, refreshToken)
      .then((data) => data)
      .catch(error => {
        throw new BadRequestException(error, 'refreshToken')
      });
  }

  async getAccount(username: string) {
    return this.prisma.account.findFirst({ where: { username } });
  }
}
