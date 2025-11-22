import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
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
    const date = new Date(dto.hora_dia);

    if (dto.partido.contrincante === userData.equipoId)
      throw new BadRequestException('No puedes crear un partido contra tí');

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

  async update(userData: JwtPayload, id: number, dto: UpdateMatchDto) {
    const findMatch = await this.findById(id);
    const newOpponent = dto.partido?.contrincante;

    const verifyCreator = this.verifyCreatorMatch(findMatch, userData.id);

    if (!verifyCreator)
      throw new UnauthorizedException(
        'No tienes permisos para realizar esta acción',
      );

    if (newOpponent === userData.equipoId)
      throw new BadRequestException('Error al actualizar al información');

    if (dto.hora_dia) {
      findMatch.hora_dia = new Date(dto.hora_dia);
    }

    if (dto.partido?.canchaId) {
      findMatch.cancha = { id: dto.partido.canchaId } as any;
    }

    if (newOpponent) {
      const opponentTeam = await this.matchTeamRepository.findOne({
        where: {
          partido: { id: findMatch.id },
          es_local: false,
        },
        relations: ['equipo'],
      });
      if (!opponentTeam) {
        throw new InternalServerErrorException(
          'Registro de equipo visitante no encontrado',
        );
      }

      const completeTeam = await this.teamService.findById(newOpponent);
      if (!completeTeam)
        throw new BadRequestException('Contrincante no encontrado');

      opponentTeam!.equipo = completeTeam;

      await this.matchTeamRepository.save(opponentTeam);
    }

    try {
      await this.matchRepository.save(findMatch);
      return await this.findById(id);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          'Ya existe un partido con esa hora y cancha',
        );
      } else {
        throw new InternalServerErrorException(
          'Error al actualizar el partido',
        );
      }
    }
  }

  async remove(userData: JwtPayload, id: number) {
    const findMatch = await this.findById(id);
    const verifyCreator = this.verifyCreatorMatch(findMatch, userData.id);

    if (!verifyCreator)
      throw new UnauthorizedException(
        'No tienes permiso para realizar esta acción',
      );

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

  private verifyCreatorMatch(match: MatchEntity, userId: number) {
    const localTeam = match.equipos.find((equipo) => equipo.es_local);

    if (!localTeam || !localTeam.equipo || !localTeam.equipo.creador) {
      throw new Error(
        'El equipo local o el capitán no están definidos correctamente.',
      );
    }

    return localTeam.equipo.creador.id === userId;
  }
}
