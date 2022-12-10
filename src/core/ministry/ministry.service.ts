import { Injectable } from '@nestjs/common';

@Injectable()
export class MinistryService {
  getMinistry(): string {
    return 'Hello Ministry!';
  }
}
