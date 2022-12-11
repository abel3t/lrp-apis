import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto
} from './organization.dto';
import {
  CurrentAccount,
  ICurrentAccount
} from '../../decorators/account.decorator';
import { AuthGuard } from 'guards/auth.guard';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from 'decorators/roles.decorator';
import { GlobalRole } from '../account/account.enum';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(GlobalRole.Global_Admin)
  createOrganization(
    @CurrentAccount() account: ICurrentAccount,
    @Body() body: CreateOrganizationDto
  ) {
    return this.organizationService.create(account, body);
  }

  @Put()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(GlobalRole.Global_Admin)
  updateOrganizations(
    @CurrentAccount() account: ICurrentAccount,
    @Body() body: UpdateOrganizationDto
  ) {
    return this.organizationService.update(account, body);
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

  @Post(':id/admins')
  addOrganizationAdmin() {
    return this.organizationService.addAdmin();
  }

  @Delete(':id/admins/:adminId')
  deleteOrganizationAdmin() {
    return this.organizationService.deleteAdmin();
  }
}
