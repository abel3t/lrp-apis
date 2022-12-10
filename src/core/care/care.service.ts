import { Injectable } from '@nestjs/common';

@Injectable()
export class CareService {
  getCare(): string {
    return 'Hello Care!';
  }
}
