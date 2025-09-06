import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  // Función Promise<{ message: string}>
  async register(dto: RegisterDto) {
    // 1. Verificar si ya existe un usuario con el correo ingresado
    //    -> Usar userService.findByEmail(dto.correo_electronico)
    //    -> Si existe, lanzar BadRequestException('El correo ya esta registrado')
    //
    // 2. Si no existe, hashea la contraseña recibida en dto.contrasena
    //    -> Usar bcrypt.hash(dto.contrasena, HASH_SALT)
    //
    // 3. Llamar a userService.create() para crear y guardar el nuevo usuario
    //    -> Pasar dto con la contraseña ya hasheada
    //
    // 4. Retornar mensaje
    //    -> { message: 'Usuario creado correctamente' }
  }
}
