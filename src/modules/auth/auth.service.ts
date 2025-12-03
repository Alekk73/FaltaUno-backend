import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { UserEntity } from '../users/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from 'src/common/jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { MailProvider } from 'src/common/mail/mail.provider';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,

    private mailProvider: MailProvider,
  ) {}

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

    // Se genera token activación
    const tokenActivation = randomBytes(32).toString('hex');

    const user = await this.userService.create({
      ...dto,
      contrasena_hash: hashPassword,
      token_activacion: tokenActivation,
    });

    if (!user) {
      throw new BadRequestException('Error al crear el usuario');
    }

    await this.mailProvider.sendConfirmationEmail(
      user.correo_electronico,
      tokenActivation,
    );

    return {
      message:
        'Usuario creado. Revisa tu correo electronico para confirmar tu cuenta.',
    };
  }

  async login(
    dto: LoginDto,
  ): Promise<{ accessToken: string; user: UserEntity }> {
    let existUser: UserEntity | null = null;

    try {
      existUser = await this.userService.findByEmail(dto.correo_electronico);
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        throw error;
      }
    }

    if (!existUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const isMatch = await bcrypt.compare(
      dto.contrasena,
      existUser.contrasena_hash,
    );

    if (!isMatch) {
      throw new BadRequestException('Contraseña incorrecta');
    }

    const payload: JwtPayload = {
      id: existUser.id,
      correo_electronico: existUser.correo_electronico,
      rol: existUser.rol,
      equipoId: existUser.equipo?.id || null,
      visible: existUser.visible,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken, user: existUser };
  }

  async profile(userData: JwtPayload) {
    const user = await this.userService.findOne(userData.id);

    return user;
  }
}
