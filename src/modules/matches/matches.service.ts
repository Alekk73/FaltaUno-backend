import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchEntity } from './entities/match.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from 'src/common/jwt-payload';
import { MatchTeamEntity } from './entities/match-team.entity';
import { FieldsService } from '../fields/fields.service';
import { TeamsService } from '../teams/teams.service';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(MatchEntity)
    private readonly matchRepository: Repository<MatchEntity>,
    @InjectRepository(MatchTeamEntity)
    private readonly matchTeamRepository: Repository<MatchTeamEntity>,

    private readonly fieldService: FieldsService,
    private readonly teamService: TeamsService,
  ) {}

  async findAll(): Promise<MatchEntity[]> {
    const matches = await this.matchRepository.find({
      relations: [
        'cancha',
        'equipos',
        'equipos.equipo',
        'equipos.equipo.creador',
      ],
    });

    if (!matches) throw new NotFoundException('No se encontraron partidos');

    return this.transformMatchResponseArray(matches);
  }

  async findById(id: number): Promise<MatchEntity> {
    const match = await this.matchRepository.findOne({
      where: { id },
      relations: [
        'cancha',
        'equipos',
        'equipos.equipo',
        'equipos.equipo.creador',
      ],
    });

    if (!match) throw new NotFoundException('Partido no encontrado');

    return match;
  }

  async create(
    userData: JwtPayload,
    dto: CreateMatchDto,
  ): Promise<MatchEntity> {
    const date = new Date(`${dto.dia}T${dto.hora}:00:00`);

    await this.fieldService.findOne(dto.partido.canchaId);
    await this.teamService.findById(dto.partido.contrincante);

    try {
      const newMatch = this.matchRepository.create({
        hora_dia: date,
        cancha: { id: dto.partido.canchaId },
      });

      await this.matchRepository.save(newMatch);

      const matchTeams = [
        this.createMatchTeam(userData.equipoId as number, true, newMatch.id),
        this.createMatchTeam(
          dto.partido.contrincante as number,
          false,
          newMatch.id,
        ),
      ];

      await this.matchTeamRepository.save(matchTeams);

      return await this.findById(newMatch.id);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          'Ya existe un partido con esa hora y cancha',
        );
      } else {
        throw new InternalServerErrorException('Error al crear el partido');
      }
    }
  }

  async remove(userData: JwtPayload, id: number) {
    const findMatch = await this.findById(id);
    const teamsIds = findMatch.equipos.map((e) => e.equipo.id);

    if (!teamsIds.includes(userData.id))
      throw new BadRequestException('No puedes eliminar el partido');

    await this.matchRepository.remove(findMatch);
  }

  private createMatchTeam(teamId: number, local: boolean, matchId: number) {
    return this.matchTeamRepository.create({
      equipo: { id: teamId },
      es_local: local,
      partido: { id: matchId },
    });
  }

  private transformMatchResponseArray(matches: MatchEntity[]): any[] {
    return matches.map((match) => ({
      id: match.id,
      creadoEn: match.creadoEn,
      hora_dia: match.hora_dia,
      equipos: match.equipos.map((matchTeam) => ({
        equipo: {
          id: matchTeam.equipo.id,
          nombre: matchTeam.equipo.nombre,
          creador: {
            id: matchTeam.equipo.creador.id,
            nombre: matchTeam.equipo.creador.nombre,
            apellido: matchTeam.equipo.creador.apellido,
          },
        },
      })),
      cancha: {
        id: match.cancha.id,
        nombre: match.cancha.nombre,
      },
    }));
  }
}
