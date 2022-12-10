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

  public signUp({ email, password, role }: IAccount): Promise<unknown> {
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email
      }),
      new CognitoUserAttribute({
        Name: 'custom:role',
        Value: role
      }),
      new CognitoUserAttribute({
        Name: 'custom:id',
        Value: '0' // default userId
      })
    ];

    return new Promise((resolve, reject) =>
      this.userPool.signUp(
        email,
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
                email
              },
              validationData: {
                Name: 'email',
                Value: email
              }
            },
            response: {
              autoVerifyEmail: true
            }
          };

          const confirmParams = {
            UserPoolId: this.userPoolId,
            Username: email
          };

          this.updateUserCognitoAttributes(email, [
            {
              Name: 'email_verified',
              Value: 'true'
            }
          ]).catch((error_) => {
            throw new BadRequestException(error_);
          });

          new CognitoIdentityServiceProvider().adminConfirmSignUp(
            confirmParams,
            (err) => {
              if (err?.message) {
                return reject(err);
              }

              // eslint-disable-next-line no-prototype-builtins
              if (event.request?.userAttributes?.hasOwnProperty('email')) {
                event.response.autoVerifyEmail = true;
              }

              resolve(result);
            }
          );
        }
      )
    );
  }

  public signIn(email: string, password: string): Promise<unknown> {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    });
    const userData = {
      Username: email,
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

  public refreshToken(email: string, refreshToken: string): Promise<unknown> {
    const token = new CognitoRefreshToken({ RefreshToken: refreshToken });
    const cognitoUser = new CognitoUser({
      Username: email,
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

  public signOut(email: string): boolean {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: this.userPool
    });
    cognitoUser.signOut();
    return true;
  }

  public updateUserCognitoAttributes(
    email: string,
    attributes: AttributeType[]
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      new CognitoIdentityServiceProvider().adminUpdateUserAttributes(
        {
          UserAttributes: attributes,
          UserPoolId: this.userPoolId,
          Username: email
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

  public deleteUser(email: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      new CognitoIdentityServiceProvider().adminDeleteUser(
        {
          UserPoolId: this.userPoolId,
          Username: email
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
  email: string;
  password: string;
  role: string;
}
