import { Controller, Delete, Get, Post } from '@nestjs/common';
import { CareService } from './care.service';

@Controller()
export class CareController {
  constructor(private readonly careService: CareService) {}

  @Post()
  createCare() {
    return this.careService.create();
  }

  @Get()
  getCares() {
    return this.careService.getByFilter();
  }

  @Get()
  getCare() {
    return this.careService.getOne();
  }

  @Delete()
  deleteCare() {
    return this.careService.delete();
  }
}
