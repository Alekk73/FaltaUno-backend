import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamEntity } from './entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,
  ) {}

  async create(dto: CreateTeamDto): Promise<TeamEntity> {
    const team = this.teamRepository.create(dto);
    return await this.teamRepository.save(team);
  }

  async findAll(): Promise<TeamEntity[]> {
    return await this.teamRepository.find();
  }

  async findOne(id: number): Promise<TeamEntity> {
    const team = await this.teamRepository.findOne({ where: { id } });
    if (!team) throw new NotFoundException(`El equipo con id ${id} no fue encontrado`);
    return team;
  }

  async update(id: number, dto: UpdateTeamDto): Promise<TeamEntity> {
    const team = await this.findOne(id);
    Object.assign(team, dto);
    return await this.teamRepository.save(team);
  }
  
  async remove(id: number): Promise<void> {
    const team = await this.findOne(id);
    await this.teamRepository.remove(team);
  }
}
