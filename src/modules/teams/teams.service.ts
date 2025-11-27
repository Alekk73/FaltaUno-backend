import {
  BadRequestException,
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
import { RolesUser } from 'src/common/enums/roles-user.enum';

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
      where: { nombre: dto.nombre },
    });

    if (nameInUse) {
      throw new BadRequestException('Nombre ingresado ya en uso');
    }

    // Se crea el equipo con el usuario como creador
    const newTeam = this.teamRepository.create({
      nombre: dto.nombre,
      creador: { id: userData.id },
      usuarios: [{ id: userData.id }],
    });
    await this.teamRepository.save(newTeam);

    await this.usersService.update(userData.id, {
      rol: RolesUser.capitan,
    });

    // Se retorna el equipo con relaciones cargadas
    return await this.findById(newTeam.id);
  }

  // Mostrar todos los equipos
  async findAll(): Promise<TeamEntity[]> {
    return await this.teamRepository.find({
      relations: ['creador', 'usuarios'],
      select: this.responseQuery,
    });
  }

  // Mostrar un equipo por ID
  async findById(id: number): Promise<TeamEntity> {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ['creador', 'usuarios'],
      select: this.responseQuery,
    });

    if (!team) throw new NotFoundException('Equipo no encontrado');
    return team;
  }

  // Actualiza un equipo
  async update(userData: JwtPayload, dto: UpdateTeamDto): Promise<TeamEntity> {
    if (userData.rol !== RolesUser.capitan) {
      throw new BadRequestException('No eres el capitan del equipo');
    }

    const newNameTeamInUse = await this.teamRepository.findOne({
      where: { nombre: dto.nombre },
    });

    if (newNameTeamInUse) {
      throw new BadRequestException('Nombre ingresado ya existente');
    }

    const team = await this.findById(Number(userData.equipoId));
    Object.assign(team, dto);

    await this.teamRepository.save(team);

    return await this.findById(team.id);
  }

  // Elimina un equipo
  async remove(userData: JwtPayload): Promise<void> {
    if (userData.equipoId === null) {
      throw new BadRequestException('No existe equipo a eliminar');
    }

    const team = await this.findById(userData.equipoId);

    if (!team) {
      throw new NotFoundException('Equipo no encontrado');
    }

    if (team.creador.id !== userData.id) {
      throw new ForbiddenException('Solo el capitán puede eliminar el equipo');
    }

    for (const user of team.usuarios) {
      await this.usersService.update(user.id, {
        rol: RolesUser.usuario,
      });
    }

    await this.teamRepository.remove(team);
  }

  private responseQuery = {
    id: true,
    nombre: true,
    creadoEn: true,
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
