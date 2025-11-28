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
import { TeamsService } from '../teams/teams.service';
import { MatchStatusResult } from 'src/common/enums/match-status-result.enum';
import { FieldsService } from '../fields/fields.service';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(MatchEntity)
    private readonly matchRepository: Repository<MatchEntity>,
    @InjectRepository(MatchTeamEntity)
    private readonly matchTeamRepository: Repository<MatchTeamEntity>,

    private readonly teamService: TeamsService,
    private readonly fielService: FieldsService,
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

    if (matches.length === 0)
      throw new NotFoundException('No se encontraron partidos');

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

  async findByUser(userData: JwtPayload) {
    const matches = await this.matchTeamRepository.find({
      where: { equipo: { creador: { id: userData.id } } },
      relations: ['equipo', 'partido'],
    });

    if (matches.length === 0)
      throw new NotFoundException(
        'No se encontraron partidos para este equipo',
      );

    return matches;
  }

  async create(
    userData: JwtPayload,
    dto: CreateMatchDto,
  ): Promise<MatchEntity | void> {
    const date = new Date(dto.hora_dia);
    const opponentId = dto.partido.contrincante as number;

    await this.fielService.findOne(dto.partido.canchaId);

    try {
      const newMatch = this.matchRepository.create({
        hora_dia: date,
        cancha: { id: dto.partido.canchaId },
      });

      await this.matchRepository.save(newMatch);

      const matchTeams = [
        this.createMatchTeam(userData.equipoId as number, true, newMatch.id),
      ];

      if (opponentId !== undefined && opponentId !== null) {
        if (opponentId === userData.equipoId)
          throw new BadRequestException(
            'No puedes crear un partido contra ti mismo',
          );

        const opponent = await this.teamService.findById(opponentId);

        matchTeams.push(this.createMatchTeam(opponent.id, false, newMatch.id));
      }

      await this.matchTeamRepository.save(matchTeams);

      return await this.findById(newMatch.id);
    } catch (error) {
      this.handleSaveError(error);
    }
  }

  async update(
    userData: JwtPayload,
    id: number,
    dto: UpdateMatchDto,
  ): Promise<MatchEntity | void> {
    const findMatch = await this.findById(id);
    const newOpponent = dto.partido?.contrincante;

    this.checkMatchCreator(findMatch, userData.id);
    this.checkOpponent(findMatch.id, newOpponent as number);

    await this.updateMatchDetails(findMatch, dto, newOpponent as number);

    try {
      await this.matchRepository.save(findMatch);
      return await this.findById(id);
    } catch (error) {
      this.handleSaveError(error);
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

  async leaveMatch(userData: JwtPayload, id: number) {
    const findMatch = await this.findById(id);
    const opponentTeam = findMatch.equipos.find((team) => !team.es_local);
    if (!opponentTeam) {
      throw new InternalServerErrorException(
        'Registro de equipos visitante no encontrado',
      );
    }

    if (userData.equipoId !== opponentTeam.equipo?.id)
      throw new UnauthorizedException(
        'No tienes permisos para ejecutar la acción',
      );

    await this.matchTeamRepository.remove(opponentTeam);

    return { message: 'Has salido del partido correctamente' };
  }

  async joinMatch(userData: JwtPayload, id: number) {
    const match = await this.findById(id);

    if (match.equipos.length >= 2)
      throw new BadRequestException('El partido ya tiene dos equipos');

    const teamLocal = match.equipos.some(
      (matchTeam) => matchTeam.equipo?.id === userData.equipoId,
    );
    if (teamLocal) {
      throw new BadRequestException(
        'Este equipo ya está participando en el partido',
      );
    }

    const newTeam = this.createMatchTeam(
      userData.equipoId as number,
      false,
      match.id,
    );

    await this.matchTeamRepository.save(newTeam);

    return { message: 'Te uniste al partido correctamente' };
  }

  async changeResult(userData: JwtPayload, id: number, dto: UpdateMatchDto) {
    const findMatch = await this.findById(id);
    if (
      findMatch.estado_resultado === MatchStatusResult.CONFIRMADO ||
      findMatch.estado_resultado === MatchStatusResult.INDEFINIDO
    ) {
      throw new BadRequestException('No se puede cambiar el resultado');
    }

    const teams = findMatch.equipos;

    const localTeam = teams.find((team) => team.es_local) as MatchTeamEntity;
    if (localTeam.equipo?.id !== userData.equipoId)
      throw new UnauthorizedException(
        'No puedes cambiar el resultado del partido',
      );

    if (dto.goles_local !== undefined || dto.goles_visitante !== undefined) {
      for (const matchTeam of teams) {
        if (matchTeam.es_local) {
          matchTeam.goles_local = dto.goles_local as number;
        } else {
          matchTeam.goles_visitante = dto.goles_visitante as number;
        }
      }
    }

    await this.matchTeamRepository.save(teams);

    findMatch.estado_resultado = MatchStatusResult.CONFIRMACION_PENDIENTE;

    await this.matchRepository.save(findMatch);

    return { message: 'Resultado actualizado' };
  }

  async confirmResult(userData: JwtPayload, id: number) {
    const findMatch = await this.findById(id);
    const teams = findMatch.equipos;

    const visitorTeam = teams.find((team) => !team.es_local) as MatchTeamEntity;
    if (visitorTeam.equipo?.id !== userData.equipoId) {
      throw new UnauthorizedException(
        'No tienes autorización para realizar la acción',
      );
    }

    findMatch.estado_resultado = MatchStatusResult.CONFIRMADO;

    await this.matchRepository.save(findMatch);

    return { message: 'Resultado confirmado' };
  }

  async rejecetResult(userData: JwtPayload, id: number) {
    const match = await this.findById(id);

    if (match.estado_resultado !== MatchStatusResult.CONFIRMACION_PENDIENTE) {
      throw new BadRequestException('No puedes ejecutar la acción');
    }

    const matchTeams = match.equipos;
    const visitorTeam = matchTeams.find(
      (team) => !team.es_local,
    ) as MatchTeamEntity;

    if (userData.equipoId !== visitorTeam.equipo?.id)
      throw new UnauthorizedException(
        'No tienes autorización para realizar la acción',
      );

    matchTeams.map((team) => {
      if (team.goles_local === null) {
        team.goles_visitante = null;
      } else {
        team.goles_local = null;
      }
    });

    match.estado_resultado = MatchStatusResult.INDEFINIDO;

    await this.matchRepository.save(match);
    await this.matchTeamRepository.save(matchTeams);

    return { message: 'Resultado rechazado correctamente' };
  }

  // METODOS PRIVADOS
  private async updateOpponentTeam(match: MatchEntity, opponent: number) {
    const opponentTeam = match.equipos.find((team) => !team.es_local);
    if (!opponentTeam) {
      throw new InternalServerErrorException(
        'Registro de equipos visitante no encontrado',
      );
    }

    const completeTeam = await this.teamService.findById(opponent);
    if (!completeTeam) {
      throw new BadRequestException('Contrincante no encontrado');
    }

    opponentTeam.equipo = completeTeam;
    await this.matchTeamRepository.save(opponentTeam);
  }

  private async updateMatchDetails(
    match: MatchEntity,
    dto: UpdateMatchDto,
    opponent: number,
  ) {
    if (dto.hora_dia) {
      match.hora_dia = new Date(dto.hora_dia);
    }

    if (dto.partido?.canchaId) {
      match.cancha = { id: dto.partido.canchaId } as any;
    }

    if (opponent) {
      await this.updateOpponentTeam(match, opponent);
    }
  }

  private createMatchTeam(teamId: number, local: boolean, matchId: number) {
    return this.matchTeamRepository.create({
      equipo: { id: teamId },
      es_local: local,
      partido: { id: matchId },
    });
  }

  private checkOpponent(teamId: number, opponentId: number) {
    if (opponentId === teamId) {
      throw new BadRequestException('Error al actualizar al información');
    }
  }

  private checkMatchCreator(match: MatchEntity, userId: number) {
    const isCreator = this.verifyCreatorMatch(match, userId);
    if (!isCreator) {
      throw new UnauthorizedException(
        'No tienes permisos para realizar esta acción',
      );
    }
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

  private transformMatchResponseArray(matches: MatchEntity[]): any[] {
    return matches.map((match) => ({
      id: match.id,
      creadoEn: match.creadoEn,
      hora_dia: match.hora_dia,
      estado_resultado: match.estado_resultado,
      equipos: match.equipos.map((matchTeam) => ({
        equipo: {
          id: matchTeam.equipo?.id,
          nombre: matchTeam.equipo?.nombre,
          es_local: matchTeam.es_local,
          goles:
            matchTeam.es_local === true
              ? (matchTeam.goles_local ?? 0) // se asigna 0 si el valor de los goles es null
              : (matchTeam.goles_visitante ?? 0),
          creador: {
            id: matchTeam.equipo?.creador.id,
            nombre: matchTeam.equipo?.creador.nombre,
            apellido: matchTeam.equipo?.creador.apellido,
          },
        },
      })),
      cancha: {
        id: match.cancha.id,
        nombre: match.cancha.nombre,
      },
    }));
  }

  private handleSaveError(error: any) {
    if (error.code === '23505') {
      throw new ConflictException('Ya existe un partido con esa hora y cancha');
    }
    throw new InternalServerErrorException(
      'Error al crear o actualizar el partido',
    );
  }
}
