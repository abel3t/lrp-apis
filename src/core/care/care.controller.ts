import { Controller, Get } from '@nestjs/common';
import { CareService } from './care.service';

@Controller()
export class CareController {
  constructor(private readonly accountService: CareService) {}

  @Get('/care')
  getCare(): string {
    return this.accountService.getCare();
  }
}
