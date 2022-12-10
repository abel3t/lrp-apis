import { Controller, Delete, Get, Post } from '@nestjs/common';
import { CareService } from './care.service';

@Controller('cares')
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

  @Get(':id')
  getCare() {
    return this.careService.getOne();
  }

  @Delete(':id')
  deleteCare() {
    return this.careService.delete();
  }
}
