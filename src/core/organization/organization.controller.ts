import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(GlobalRole.Global_Admin)
  getOrganization() {
    return this.organizationService.getOne();
  }

  @Get(':id/admins')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(GlobalRole.Global_Admin)
  getOrganizationAdmins(@Param('id') organizationId: string) {
    return this.organizationService.getAdmins(organizationId);
  }

  @Post(':id/admins')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(GlobalRole.Global_Admin)
  addOrganizationAdmin() {
    return this.organizationService.addAdmin();
  }

  @Delete(':id/admins/:adminId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(GlobalRole.Global_Admin)
  deleteOrganizationAdmin() {
    return this.organizationService.deleteAdmin();
  }
}
