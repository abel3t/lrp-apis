import { Injectable } from '@nestjs/common';
import { CognitoService } from 'shared/services/cognito.service';

@Injectable()
export class AccountService {
  constructor(
    private readonly cognitoService: CognitoService
  ) {}

  createGlobalAdmin() {
    return this.cognitoService.signUp({
      username: '',
      password: '',
      role: 'Admin'
    }).then(() => console.log('OK'))
      .catch((error) => console.log('bugs', error));
  }

  login() {
    return this.cognitoService.signIn('', '')
  }

  getAccount(): string {
    return 'Hello Account!';
  }
}
