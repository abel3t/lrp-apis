import { Controller, Delete, Get, Post } from '@nestjs/common';
import { OrganizationService } from './organization.service';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  createOrganization() {
    return this.organizationService.create();
  }

  @Get()
  getOrganizations() {
    return this.organizationService.getByFilter();
  }

  @Get(':id')
  getOrganization() {
    return this.organizationService.getOne();
  }

  @Get(':id/admins')
  getOrganizationAdmins() {
    return this.organizationService.getAdmins();
  }

  @Post()
  addOrganizationAdmin() {
    return this.organizationService.addAdmin();
  }

  @Delete()
  deleteOrganizationAdmin() {
    return this.organizationService.deleteAdmin();
  }
}
