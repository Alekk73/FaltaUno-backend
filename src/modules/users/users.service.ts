import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtPayload } from 'src/common/jwt-payload';
import { RolesUser } from 'src/common/enums/roles-user.enum';
import { TokenEntity } from './entity/token.entity';
import { TypeToken } from 'src/common/enums/type-token.enum';
import { randomBytes } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(TokenEntity)
    private tokenRepository: Repository<TokenEntity>,
  ) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(dto);
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { correo_electronico: email },
      relations: ['equipo'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }

    return user;
  }

  async findByDocument(doc: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { documento: doc },
      relations: ['equipo'],
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    return user;
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['equipo'],
      select: {
        id: true,
        nombre: true,
        apellido: true,
        correo_electronico: true,
        visible: true,
        rol: true,
        equipo: {
          id: true,
          nombre: true,
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async findAvailableUsers(): Promise<UserEntity[]> {
    const users = await this.userRepository.find({ where: { visible: true } });

    if (users.length === 0)
      throw new NotFoundException('No existen usuarios libres');

    return users;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOne(id);

    // Check if email is being updated and if it's already taken
    if (
      updateUserDto.correo_electronico &&
      updateUserDto.correo_electronico !== user.correo_electronico
    ) {
      const existingUser = await this.userRepository.findOne({
        where: { correo_electronico: updateUserDto.correo_electronico },
      });

      if (existingUser) {
        throw new ConflictException(
          `El email ${updateUserDto.correo_electronico} ya está en uso`,
        );
      }
    }

    // Update the user
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(userId: number): Promise<{ message: string }> {
    const user = await this.findOne(userId);

    await this.userRepository.delete({ id: user.id });

    return { message: 'Usuario eliminado correctamente' };
  }

  async changeVisibility(userData: JwtPayload) {
    const user = await this.findOne(userData.id);

    if (
      user.rol === RolesUser.PLAYER ||
      user.rol === RolesUser.CAPTAIN ||
      user.rol === RolesUser.ADMIN
    )
      throw new BadRequestException(
        'No puedes cambiar tu visibilidad de usuario',
      );

    user.visible = !user.visible;

    await this.userRepository.save(user);

    return { mesagge: 'Cambio de visibilidad realizado' };
  }

  async leaveTeam(userId: number, teamId: number): Promise<void> {
    const user = await this.findOne(userId);

    if (user.rol === RolesUser.CAPTAIN)
      throw new BadRequestException('El capitan no puede salir del equipo');

    user.equipo = null;
    user.rol = RolesUser.USER;
    await this.userRepository.save(user);
  }

  async createToken(userId: number, tipo: TypeToken) {
    // Se genera token activación
    const token = randomBytes(32).toString('hex');
    // Se establece la fecha de expiración dependiento el tipo de token
    const expirationDate = new Date();
    if (tipo === TypeToken.ACTIVATION) {
      expirationDate.setDate(expirationDate.getDate() + 1);
    } else {
      expirationDate.setHours(expirationDate.getHours() + 1);
    }

    const newToken = this.tokenRepository.create({
      usuario: { id: userId },
      tipo,
      token,
      expiracion: expirationDate,
    });

    await this.tokenRepository.save(newToken);

    return token;
  }

  async findToken(token: string): Promise<TokenEntity | null> {
    return this.tokenRepository.findOne({
      where: { token },
      relations: ['usuario'],
    });
  }

  async activateUser(token: string) {
    const tokenWithUser = await this.findToken(token);
    if (!tokenWithUser) throw new UnauthorizedException('Token inválido');

    const currentDate = new Date();
    if (
      tokenWithUser.expiracion &&
      tokenWithUser.tipo === TypeToken.ACTIVATION &&
      currentDate > tokenWithUser.expiracion
    ) {
      throw new BadRequestException('El token de activación ha expirado');
    }

    tokenWithUser.usuario.verificado = true;

    await this.userRepository.save(tokenWithUser.usuario);
    await this.deleteRegisterToken(tokenWithUser.id);
  }

  async deleteRegisterToken(registerTokenId: number) {
    await this.tokenRepository.delete(registerTokenId);
  }
}
