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
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(MatchEntity)
    private readonly matchRepository: Repository<MatchEntity>,
    @InjectRepository(MatchTeamEntity)
    private readonly matchTeamRepository: Repository<MatchTeamEntity>,

    private readonly teamService: TeamsService,
    private readonly userService: UsersService,
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

  async create(
    userData: JwtPayload,
    dto: CreateMatchDto,
  ): Promise<MatchEntity | void> {
    const date = new Date(dto.hora_dia);
    const opponent = await this.teamService.findById(dto.partido.contrincante);

    if (opponent.id === userData.equipoId)
      throw new BadRequestException('No puedes crear un partido contra tí');

    try {
      const newMatch = this.matchRepository.create({
        hora_dia: date,
        cancha: { id: dto.partido.canchaId },
      });

      await this.matchRepository.save(newMatch);

      const matchTeams = [
        this.createMatchTeam(userData.equipoId as number, true, newMatch.id),
        this.createMatchTeam(opponent.id, false, newMatch.id),
      ];

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
    const newOpponent = await this.userService.findOne(
      dto.partido?.contrincante as number,
    );

    this.checkMatchCreator(findMatch, userData.id);
    this.checkOpponent(findMatch.id, newOpponent);

    await this.updateMatchDetails(findMatch, dto, newOpponent);

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

  // METODOS PRIVADOS
  private async updateOpponentTeam(match: MatchEntity, opponent: UserEntity) {
    const opponentTeam = await this.matchTeamRepository.findOne({
      where: {
        partido: { id: match.id },
        es_local: false,
      },
      relations: ['equipo'],
    });

    if (!opponentTeam) {
      throw new InternalServerErrorException(
        'Registro de equipo visitante no encontrado',
      );
    }

    const completeTeam = await this.teamService.findById(opponent.id);
    if (!completeTeam) {
      throw new BadRequestException('Contrincante no encontrado');
    }

    opponentTeam.equipo = completeTeam;
    await this.matchTeamRepository.save(opponentTeam);
  }

  private async updateMatchDetails(
    match: MatchEntity,
    dto: UpdateMatchDto,
    opponent: UserEntity,
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

  private checkOpponent(teamId: number, opponent: UserEntity) {
    if (opponent.id === teamId) {
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

  private handleSaveError(error: any) {
    if (error.code === '23505') {
      throw new ConflictException('Ya existe un partido con esa hora y cancha');
    }
    throw new InternalServerErrorException(
      'Error al crear o actualizar el partido',
    );
  }
}
