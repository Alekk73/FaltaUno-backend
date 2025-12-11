import { SetMetadata } from '@nestjs/common';
import { RolesUser } from '../enums/roles-user.enum';

export const ROLES_KEY = 'roles';
export const Roles = (role: RolesUser) => SetMetadata(ROLES_KEY, role);
