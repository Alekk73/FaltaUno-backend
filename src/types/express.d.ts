import { RolesUser } from '../common/enums/roles-user.enum';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HASH_SALT: number;
      JWT_SECRET: string;
      SENDGRID_API_KEY: string;
      EMAIL_SENDGRID: string;
      FRONTEND_URL: string;
    }
  }
}
declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
        correo_electronico: string;
        rol: RolesUser;
        equipoId: number | null;
        visible: boolean;
      };
    }
  }
}
