import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import type { Request } from 'express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesUser } from 'src/common/enums/roles-user.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  // -------------------------
  //  GET INVITATION FOR USER
  // -------------------------
  @ApiOperation({ summary: 'Obtener invitaciones pendientes del usuario' })
  @ApiOkResponse({ description: 'Retorna las invitaciones' })
  @ApiNotFoundResponse({
    description: 'No se encontraron invitaciones pendientes',
  })
  @Get()
  async findPendingInvitationsForUser(@Req() req: Request) {
    const user = req.user;
    return await this.invitationsService.findPendingInvitationsForUser(user);
  }

  // -------------------------
  //  CREATE
  // -------------------------
  @ApiBody({ type: CreateInvitationDto })
  @ApiOperation({ summary: 'Crear invitación' })
  @ApiOkResponse({ description: 'Retorna los datos de la invitación creada' })
  @ApiBadRequestResponse({
    description: 'Usuario a invitar ya pertenece a un equipo',
  })
  @ApiConflictResponse({ description: 'Invitación ya existente' })
  @UseGuards(RolesGuard)
  @Roles(RolesUser.capitan)
  @Post()
  async create(@Req() req: Request, @Body() dto: CreateInvitationDto) {
    const user = req.user;
    return await this.invitationsService.create(user, dto);
  }

  // -------------------------
  //  ACCEPT INVITATION
  // -------------------------
  @ApiOperation({
    summary: 'Aceptar invitación con el identificador solicidado',
  })
  @ApiOkResponse({ description: 'Invitación aceptada' })
  @ApiBadRequestResponse({ description: 'No puedes aceptar esta invitación' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la invitación',
    type: Number,
    example: 1,
  })
  @Put('accept/:id')
  async acceptInvitation(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user = req.user;
    return await this.invitationsService.acceptInvitation(user, id);
  }

  // -------------------------
  //  REJECT INVITATION
  // -------------------------
  @ApiOperation({
    summary: 'Rechazar invitación con el identificador solicitado ',
  })
  @ApiOkResponse({ description: 'Invitación rechazada' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la invitación',
    type: Number,
    example: 1,
  })
  @Put('reject/:id')
  async rejectInvitation(@Param('id', ParseIntPipe) id: number) {
    return await this.invitationsService.rejectInvitation(id);
  }
}
