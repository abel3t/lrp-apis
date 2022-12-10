import { Injectable } from '@nestjs/common';

@Injectable()
export class FriendService {
  getFriend(): string {
    return 'Hello Friend!';
  }
}
