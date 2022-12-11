import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession
} from 'amazon-cognito-identity-js';
import { CognitoIdentityServiceProvider, config as AwsConfig } from 'aws-sdk';
import { AttributeType } from 'aws-sdk/clients/cognitoidentityserviceprovider';

import { AppConfig } from '../config';

export interface ICognitoTokenInfo {
  token: string;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class CognitoService {
  logger = new Logger('CognitoService');

  private readonly userPool: CognitoUserPool;
  private readonly userPoolId: string;

  constructor() {
    this.userPoolId = AppConfig.AWS.COGNITO.USER_POOL_ID;

    this.userPool = new CognitoUserPool({
      UserPoolId: AppConfig.AWS.COGNITO.USER_POOL_ID,
      ClientId: AppConfig.AWS.COGNITO.APP_CLIENT_ID
    });

    const region = AppConfig.AWS.COGNITO.REGION;
    const accessKeyId = AppConfig.AWS.ACCESS_KEY_ID;
    const secretAccessKey = AppConfig.AWS.SECRET_ACCESS_KEY;

    AwsConfig.update({
      accessKeyId,
      secretAccessKey,
      region
    });
  }

  public signUp({ username, password, role }: IAccount): Promise<unknown> {
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'custom:role',
        Value: role
      }),
      new CognitoUserAttribute({
        Name: 'custom:id',
        Value: '0' // default accountId
      }),
      new CognitoUserAttribute({
        Name: 'custom:organizationId',
        Value: '0' // default organizationId
      })
    ];

    return new Promise((resolve, reject) =>
      this.userPool.signUp(
        username,
        password,
        attributeList,
        undefined,
        (error, result) => {
          if (error?.message) {
            return reject(error);
          }

          const event = {
            request: {
              userAttributes: {
                username
              },
              validationData: {
                Name: 'username',
                Value: username
              }
            },
            response: {
              autoVerifyEmail: true
            }
          };

          const confirmParams = {
            UserPoolId: this.userPoolId,
            Username: username
          };

          new CognitoIdentityServiceProvider().adminConfirmSignUp(
            confirmParams,
            (err) => {
              if (err?.message) {
                return reject(err);
              }

              // eslint-disable-next-line no-prototype-builtins
              if (event.request?.userAttributes?.hasOwnProperty('username')) {
                event.response.autoVerifyEmail = true;
              }

              resolve(result);
            }
          );
        }
      )
    );
  }

  public signIn(username: string, password: string): Promise<unknown> {
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password
    });
    const userData = {
      Username: username,
      Pool: this.userPool
    };

    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) =>
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result: CognitoUserSession) => {
          Logger.log('Login successfully!');
          resolve({
            token: result.getIdToken().getJwtToken(),
            accessToken: result.getAccessToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken()
          } as ICognitoTokenInfo);
        },
        onFailure(err) {
          reject(err);
        }
      })
    ).catch((error) => {
      throw new BadRequestException(error);
    });
  }

  public refreshToken(username: string, refreshToken: string): Promise<unknown> {
    const token = new CognitoRefreshToken({ RefreshToken: refreshToken });
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: this.userPool
    });

    return new Promise((resolve, reject) =>
      cognitoUser.refreshSession(token, (error, session) => {
        if (error) {
          reject(error);
        } else {
          Logger.log('Refresh token successfully!');
          resolve({
            token: session.idToken.jwtToken,
            accessToken: session.accessToken.jwtToken,
            refreshToken: session.refreshToken.token
          });
        }
      })
    );
  }

  public signOut(username: string): boolean {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: this.userPool
    });
    cognitoUser.signOut();
    return true;
  }

  public updateUserCognitoAttributes(
    username: string,
    attributes: AttributeType[]
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      new CognitoIdentityServiceProvider().adminUpdateUserAttributes(
        {
          UserAttributes: attributes,
          UserPoolId: this.userPoolId,
          Username: username
        },
        (error) => {
          if (error?.message) {
            reject(error);
          } else {
            Logger.log(
              `Updated attribute ${JSON.stringify(attributes)}`,
              'updateUserCognitoAttributes'
            );
            resolve(true);
          }
        }
      );
    });
  }

  public deleteUser(username: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      new CognitoIdentityServiceProvider().adminDeleteUser(
        {
          UserPoolId: this.userPoolId,
          Username: username
        },
        (error) => {
          if (error?.message) {
            reject(error);
          } else {
            Logger.log('Successfully', 'deleteUserCognito');
            resolve(true);
          }
        }
      );
    });
  }
}

interface IAccount {
  username: string;
  password: string;
  role: string;
}
