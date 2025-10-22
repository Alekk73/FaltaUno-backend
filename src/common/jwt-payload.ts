import { RolesUser } from './enums/roles-user.enum';

export interface JwtPayload {
  id: number;
  correo_electronico: string;
  rol: RolesUser;
  // teamId: number | null;
}
