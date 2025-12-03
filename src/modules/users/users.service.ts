import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtPayload } from 'src/common/jwt-payload';
import { RolesUser } from 'src/common/enums/roles-user.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
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
      user.rol === RolesUser.jugador ||
      user.rol === RolesUser.capitan ||
      user.rol === RolesUser.admin
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

    if (user.rol === RolesUser.capitan)
      throw new BadRequestException('El capitan no puede salir del equipo');

    user.equipo = null;
    user.rol = RolesUser.usuario;
    await this.userRepository.save(user);
  }

  async findByActivationToken(token: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { token_activacion: token } });
  }

  async activateUser(user: UserEntity) {
    user.verificado = true;
    user.token_activacion = null;

    await this.userRepository.save(user);
  }
}
