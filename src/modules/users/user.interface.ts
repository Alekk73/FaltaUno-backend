import { RolesUser } from 'src/common/enums/roles-user.enum';
import { TeamEntity } from '../teams/entities/team.entity';

export interface IUser {
  nombre: string;
  apellido: string;
  correo_electronico: string;
  contrasena_hash: string;
  rol: RolesUser;
  equipo: TeamEntity | null;
}
