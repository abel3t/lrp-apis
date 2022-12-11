
import { SetMetadata } from '@nestjs/common';
import { GlobalRole } from 'core/account/account.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: GlobalRole[]) => SetMetadata(ROLES_KEY, roles);