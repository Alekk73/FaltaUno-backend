import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamEntity } from './entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { UserEntity } from 'src/modules/users/entities/user.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // Crear un equipo
  async create(dto: CreateTeamDto, userId: number): Promise<TeamEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario creador no encontrado');

    // Se crea el equipo con el usuario como creador
    const nuevoEquipo = this.teamRepository.create({
      nombre: dto.nombre,
      owner: user,
      usuarios: [user],
    });

    await this.teamRepository.save(nuevoEquipo);

    // Se retorna el equipo con relaciones cargadas
    const equipoConRelaciones = await this.teamRepository.findOne({
      where: { id: nuevoEquipo.id },
      relations: ['creador', 'usuarios'],
    });

    if (!equipoConRelaciones) {
      throw new NotFoundException('Error al crear el equipo');
    }

    return equipoConRelaciones;
  }

  // Mostrar todos los equipos
  async findAll(): Promise<TeamEntity[]> {
    return await this.teamRepository.find({
      relations: ['creador', 'usuarios'],
    });
  }

  // Mostrar un equipo por ID
  async findOne(id: number): Promise<TeamEntity> {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ['creador', 'usuarios'],
    });

    if (!team) throw new NotFoundException('Equipo no encontrado');
    return team;
  }

  // Actualiza un equipo
  async update(id: number, dto: UpdateTeamDto): Promise<TeamEntity> {
    const team = await this.findOne(id);
    Object.assign(team, dto);
    return await this.teamRepository.save(team);
  }

  // Elimina un equipo
  async remove(id: number): Promise<void> {
    const team = await this.findOne(id);
    await this.teamRepository.remove(team);
  }

  // Agrega un usuario 
  async addMember(teamId: number, userId: number): Promise<TeamEntity> {
    const team = await this.findOne(teamId);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    team.usuarios.push(user);
    return await this.teamRepository.save(team);
  }
}
