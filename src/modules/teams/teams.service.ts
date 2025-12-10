import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamEntity } from './entity/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { UsersService } from '../users/users.service';
import { JwtPayload } from 'src/common/jwt-payload';
import { RolesUser } from '../../common/enums/roles-user.enum';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,

    private readonly usersService: UsersService,
  ) {}

  // Crear un equipo
  async create(userData: JwtPayload, dto: CreateTeamDto): Promise<TeamEntity> {
    if (userData.equipoId !== null) {
      throw new BadRequestException('Ya tiene un equipo.');
    }

    const nameInUse = await this.teamRepository.findOne({
      where: { nombre: dto.nombre, activo: true },
    });

    if (nameInUse) {
      throw new ConflictException('Nombre ingresado ya en uso');
    }

    // Se crea el equipo con el usuario como creador
    const newTeam = this.teamRepository.create({
      nombre: dto.nombre,
      creador: { id: userData.id },
      usuarios: [{ id: userData.id }],
      cantidad_jugadores: +1,
    });
    await this.teamRepository.save(newTeam);

    await this.usersService.update(userData.id, {
      visible: false,
      rol: RolesUser.CAPTAIN,
    });

    // Se retorna el equipo con relaciones cargadas
    return await this.findById(newTeam.id);
  }

  // Mostrar todos los equipos
  async findAll(): Promise<TeamEntity[]> {
    return await this.teamRepository.find({
      where: { activo: true },
      relations: ['creador', 'usuarios'],
      select: this.responseQuery,
    });
  }

  // Mostrar un equipo por ID
  async findById(id: number): Promise<TeamEntity> {
    const team = await this.teamRepository.findOne({
      where: { id, activo: true },
      relations: ['creador', 'usuarios'],
      select: this.responseQuery,
    });

    if (!team) throw new NotFoundException('Equipo no encontrado');
    return team;
  }

  // Actualiza un equipo
  async update(userData: JwtPayload, dto: UpdateTeamDto): Promise<TeamEntity> {
    const newNameTeamInUse = await this.teamRepository.findOne({
      where: { nombre: dto.nombre, activo: true },
    });

    if (newNameTeamInUse) {
      throw new ConflictException('Nombre ingresado ya existente');
    }

    const team = await this.findById(Number(userData.equipoId));
    Object.assign(team, dto);

    await this.teamRepository.save(team);

    return await this.findById(team.id);
  }

  // Elimina un equipo
  async remove(userData: JwtPayload): Promise<void> {
    const team = await this.findById(userData.equipoId as number);

    if (!team) {
      throw new NotFoundException('Equipo no encontrado');
    }

    if (team.creador!.id !== userData.id) {
      throw new ForbiddenException('Solo el capitán puede eliminar el equipo');
    }

    for (const user of team.usuarios) {
      await this.usersService.update(user.id, {
        equipo: null,
        rol: RolesUser.USER,
      });
    }

    await this.teamRepository.update(team.id, {
      creador: null,
      activo: false,
    });
  }

  async incrementPlayerCount(teamId: number) {
    const team = await this.findById(teamId);

    if (team.cantidad_jugadores >= 5)
      throw new BadRequestException(
        'No puedes unirte, limite de jugadores alcanzado',
      );

    team.cantidad_jugadores += 1;

    await this.teamRepository.save(team);
  }

  async leaveTeam(userData: JwtPayload): Promise<{ message: string }> {
    const team = await this.findById(userData.equipoId as number);

    team.cantidad_jugadores -= 1;

    await this.teamRepository.save(team);
    await this.usersService.leaveTeam(userData.id, team.id);

    return { message: 'Saliste de equipo correctamente' };
  }

  private responseQuery = {
    id: true,
    nombre: true,
    creadoEn: true,
    cantidad_jugadores: true,
    usuarios: {
      id: true,
      nombre: true,
      apellido: true,
      rol: true,
    },
    creador: {
      id: true,
      nombre: true,
      apellido: true,
    },
  };
}
