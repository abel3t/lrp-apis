import { Injectable } from '@nestjs/common';

@Injectable()
export class MemberService {
  getMember(): string {
    return 'Hello Member!';
  }
}
