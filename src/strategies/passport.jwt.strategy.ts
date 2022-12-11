import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfig } from 'shared/config';
import { ICurrentAccount } from '../decorators/account.decorator';

interface Payload {
  username: string;
  ['custom:id']: string;
  ['custom:role']: string;
  ['cognito:username']: string;
  ['custom:organizationId']: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const authConfig = {
      userPoolId: AppConfig.AWS.COGNITO.USER_POOL_ID,
      clientId: AppConfig.AWS.COGNITO.APP_CLIENT_ID,
      region: AppConfig.AWS.COGNITO.REGION,
      authority: `https://cognito-idp.${AppConfig.AWS.COGNITO.REGION}.amazonaws.com/${AppConfig.AWS.COGNITO.USER_POOL_ID}`
    };
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${authConfig.authority}/.well-known/jwks.json`
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: authConfig.clientId,
      issuer: authConfig.authority,
      algorithms: ['RS256'],
      passReqToCallback: true
    });
  }

  public validate(request: never, payload: Payload) {
    if (!payload) {
      throw new UnauthorizedException('could not authenticate with token!');
    }

    return {
      username: payload['cognito:username'],
      role: payload['custom:role'],
      id: payload['custom:id'],
      organizationId: payload['custom:organizationId']
    } as ICurrentAccount;
  }
}