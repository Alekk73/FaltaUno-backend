import { RolesUser } from 'src/common/enums/roles-user.enum';

export interface IUser {
  nombre: string;
  apellido: string;
  correo_electronico: string;
  contrasena_hash: string;
  rol: RolesUser;
  equipo_id: number;
}
