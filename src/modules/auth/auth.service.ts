import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
import { ChangePasswordDto } from './dto/change-password.dto';
import { MailChangePasswordDto } from './dto/mail-change-password.dto';

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
    // Se establece la fecha de expiración
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);

    const user = await this.userService.create({
      ...dto,
      contrasena_hash: hashPassword,
      token_activacion: tokenActivation,
      token_activacion_expiracion: expirationDate,
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

    if (!existUser.verificado)
      throw new UnauthorizedException('Debes verificar tu cuenta');

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

  async changePassword(
    token: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.userService.findByResetPasswordToken(token);
    if (!user) throw new UnauthorizedException('Token no valido');

    const now = new Date();
    if (
      user.token_cambio_contrasena_expiracion &&
      user.token_cambio_contrasena_expiracion < now
    )
      throw new UnauthorizedException('Token expirado');

    if (dto.nueva_contrasena !== dto.confirmar_nueva_contrasena)
      throw new BadRequestException('Las contraseñas no coinciden');

    const newPasswordHash = await bcrypt.hash(
      dto.nueva_contrasena,
      Number(process.env.HASH_SALT),
    );

    await this.userService.update(user.id, {
      contrasena_hash: newPasswordHash,
      token_cambio_contrasena: null,
      token_cambio_contrasena_expiracion: null,
    });

    return { message: 'Contraseña cambiada correctamente' };
  }

  async sendMailChangePassword(
    dto: MailChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.userService.findByEmail(dto.correo_electronico);
    if (!user.verificado)
      throw new UnauthorizedException('Cuenta no verificada');

    await this.createTokenChangePassword(user);

    return { message: 'Correo para cambiar contraseña enviado' };
  }

  async createTokenChangePassword(user: UserEntity) {
    const token = randomBytes(32).toString('hex');

    // Se establece la fecha de expiración
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);

    await this.userService.update(user.id, {
      token_cambio_contrasena: token,
      token_cambio_contrasena_expiracion: expirationDate,
    });

    await this.mailProvider.MailChangePassword(user.correo_electronico, token);
  }

  async profile(userData: JwtPayload) {
    const user = await this.userService.findOne(userData.id);

    return user;
  }
}
