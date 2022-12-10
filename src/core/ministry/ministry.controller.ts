import { Controller, Get } from '@nestjs/common';
import { MinistryService } from './ministry.service';

@Controller()
export class MinistryController {
  constructor(private readonly accountService: MinistryService) {}

  @Get('/ministry')
  getMinistry(): string {
    return this.accountService.getMinistry();
  }
}
