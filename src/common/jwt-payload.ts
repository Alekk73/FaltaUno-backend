import { RolesUser } from './enums/roles-user.enum';

export interface JwtPayload {
  id: number;
  email: string;
  rol: RolesUser;
  // teamId: number | null;
}
