declare namespace NodeJS {
  interface ProcessEnv {
    HASH_SALT: number;
    JWT_SECRET: string;
  }
}

namespace Express {
  interface Request {
    user: {
      id: number;
      correo_electronico: string;
      rol: RolesUser;
      equipoId: number | null;
    };
  }
}
