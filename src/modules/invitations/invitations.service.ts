import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InvitationEntity } from './entities/invitation.entity';
import { In, Repository } from 'typeorm';
import { JwtPayload } from 'src/common/jwt-payload';
import { UsersService } from '../users/users.service';
import { TeamsService } from '../teams/teams.service';
import { StatusInvitation } from 'src/common/enums/status-invitation.enum';
import { RolesUser } from 'src/common/enums/roles-user.enum';

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

  async findPendingInvitationsForUser(
    userData: JwtPayload,
  ): Promise<InvitationEntity[]> {
    const invitations = await this.invitationRepository.find({
      where: {
        invitado: { id: userData.id },
        estado: StatusInvitation.PENDING,
      },
      relations: ['creador', 'invitado', 'equipo'],
      select: this.responseQuery,
    });

    if (invitations.length === 0)
      throw new NotFoundException('No se encontraron invitaciónes pendientes');

    return invitations;
  }

  async acceptInvitation(
    userData: JwtPayload,
    invitationId: number,
  ): Promise<{ message: string }> {
    const invitation = await this.findById(invitationId);

    if (invitation.invitado.id !== invitationId)
      throw new BadRequestException('No puedes aceptar esta invitación');

    const user = await this.userService.findOne(userData.id);
    const team = invitation.equipo;

    await this.invitationRepository.update(invitation.id, {
      estado: StatusInvitation.ACCEPTED,
    });

    await this.userService.update(user.id, {
      rol: RolesUser.jugador,
      equipo: team.id,
    });

    await this.rejectPendingInvitations(userData);

    return { message: 'Invitación aceptada' };
  }

  async rejectInvitation(invitationId: number): Promise<{ message: string }> {
    const invitation = await this.findById(invitationId);

    await this.invitationRepository.update(invitation.id, {
      estado: StatusInvitation.REJECTED,
    });

    return { message: `Invitación rechazada` };
  }

  private async rejectPendingInvitations(userData: JwtPayload) {
    let allInvitations: InvitationEntity[] = [];

    try {
      allInvitations = await this.findPendingInvitationsForUser(userData);
    } catch (error) {
      if (!(error instanceof NotFoundException)) throw error;
    }

    if (allInvitations.length > 0) {
      await this.invitationRepository.update(
        // Con In de TypeORM se actualizan uno o varias invitaciones a la vez
        { id: In(allInvitations.map((inv) => inv.id)) },
        { estado: StatusInvitation.REJECTED },
      );
    }
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
