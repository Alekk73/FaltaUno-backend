import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InvitationEntity } from './entities/invitation.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from 'src/common/jwt-payload';
import { UsersService } from '../users/users.service';
import { TeamsService } from '../teams/teams.service';
import { StatusInvitation } from 'src/common/enums/status-invitation.enum';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(InvitationEntity)
    private readonly invitationRepository: Repository<InvitationEntity>,

    private readonly userService: UsersService,
  ) {}

  async findById(id: number): Promise<InvitationEntity> {
    const invitation = await this.invitationRepository.findOne({
      where: { id },
      relations: ['creador', 'invitado', 'equipo'],
      select: this.responseQuery,
    });

    if (!invitation) throw new NotFoundException('Invitación no encontrada');

    return invitation;
  }

  async create(
    creator: JwtPayload,
    dto: CreateInvitationDto,
  ): Promise<InvitationEntity> {
    const guest = await this.userService.findOne(dto.invitadoId);

    if (guest.equipo !== null)
      throw new BadRequestException(
        'Usuario a invitar ya pertenece a un equipo',
      );

    const existInvitation = await this.invitationRepository.findOne({
      where: {
        invitado: { id: dto.invitadoId },
        equipo: { id: creator.equipoId as number },
        estado: StatusInvitation.PENDING,
      },
    });

    if (existInvitation)
      throw new BadRequestException('Invitación ya existente');

    const newInvitation = this.invitationRepository.create({
      creador: { id: creator.id },
      invitado: { id: guest.id },
      equipo: { id: creator.equipoId as number },
    });

    await this.invitationRepository.save(newInvitation);

    return await this.findById(newInvitation.id);
  }

  private responseQuery = {
    id: true,
    creador: {
      id: true,
      nombre: true,
      apellido: true,
    },
    invitado: {
      id: true,
      nombre: true,
      apellido: true,
    },
    equipo: {
      id: true,
      nombre: true,
    },
  };
}
