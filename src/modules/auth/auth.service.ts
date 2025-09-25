import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { UserEntity } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async register(dto: RegisterDto): Promise<{ message: string }> {
    let existUser: UserEntity | null = null;

    try {
      existUser = await this.userService.findByEmail(dto.correo_electronico);
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        throw error;
      }
    }

    if (existUser) {
      throw new BadRequestException(
        'Correo electrónico ingresado ya existente',
      );
    }

    const hashPassword = await bcrypt.hash(
      dto.contrasena,
      Number(process.env.HASH_SALT),
    );

    const user = await this.userService.create({
      ...dto,
      contrasena_hash: hashPassword,
    });

    if (!user) {
      throw new BadRequestException('Error al crear el usuario');
    }

    return { message: 'Usuario creado correctamente' };
  }
}
