import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountService {
  getAccount(): string {
    return 'Hello Account!';
  }
}
