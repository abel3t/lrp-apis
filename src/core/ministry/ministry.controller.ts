import { Controller, Delete, Get, Post } from '@nestjs/common';
import { MinistryService } from './ministry.service';

@Controller('ministries')
export class MinistryController {
  constructor(private readonly ministryService: MinistryService) {}

  @Post()
  createMinistry() {
    return this.ministryService.create();
  }

  @Get()
  getMinistries() {
    return this.ministryService.getByFilter();
  }


  @Get(':id')
  getMinistry() {
    return this.ministryService.getOne();
  }

  @Post(':id')
  updateMinistry() {
    return this.ministryService.update();
  }

  @Delete(':id')
  deleteMinistry() {
    return this.ministryService.delete();
  }

  @Get(':id/members')
  getMembers() {
    return this.ministryService.getMembers();
  }

  @Post(':id/members')
  addMember() {
    return this.ministryService.addMember();
  }

  @Delete(':ministryId/members/:memberId')
  removeMember() {
    return this.ministryService.removeMember();
  }
}
