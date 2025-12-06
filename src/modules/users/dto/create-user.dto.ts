export class CreateUserDto {
  nombre: string;
  apellido: string;
  correo_electronico: string;
  contrasena_hash: string;
  token_activacion: string;
  token_activacion_expiracion: Date;
}
