import {
  BadRequestException,
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import { CognitoService } from 'shared/services/cognito.service';
import { AppConfig } from 'shared/config';
import { GlobalRole } from './account.enum';
import { PrismaService } from 'shared/services/prisma.service';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';

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
        role: GlobalRole.Global_Admin
      })
      .then(async () => {
        const newUser = await this.prisma.account.create({
          data: {
            username,
            globalRole: GlobalRole.Global_Admin
          }
        });

        await this.cognitoService.updateUserCognitoAttributes(username, [
          new CognitoUserAttribute({
            Name: 'custom:id',
            Value: newUser.id
          })
        ]);

        return true;
      })
      .catch((error) => {
        throw new BadRequestException(error, 'createGlobalAdmin');
      });
  }

  login({ username, password }) {
    return this.cognitoService.signIn(username, password);
  }

  async getAccount(username: string) {
    return this.prisma.account.findFirst({ where: { username } });
  }
}
