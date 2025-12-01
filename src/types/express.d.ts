import { RolesUser } from 'src/common/enums/roles-user.enum';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HASH_SALT: number;
      JWT_SECRET: string;
      CLOUDINARY_NAME: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
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
