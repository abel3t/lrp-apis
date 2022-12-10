import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller()
export class AdminController {
  constructor(private readonly accountService: AdminService) {}

  @Get('/admin')
  getAdmin(): string {
    return this.accountService.getAdmin();
  }
}
