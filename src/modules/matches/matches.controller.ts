import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import type { Request } from 'express';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesUser } from '../../common/enums/roles-user.enum';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  // -------------------------
  //  GET BY USER
  // -------------------------
  @ApiOperation({
    summary: 'Obtener partidos del equipo',
  })
  @ApiOkResponse({ description: 'Retorna los partidos' })
  @ApiNotFoundResponse({
    description: 'No se encontraron partidos para este equipo',
  })
  @Get('me')
  async findByUser(@Req() req: Request) {
    const user = req.user;
    return await this.matchesService.findByUser(user);
  }

  // -------------------------
  //  FIND ALL
  // -------------------------
  @ApiOperation({ summary: 'Obtener todos los partidos' })
  @ApiOkResponse({ description: 'Retorna los datos de los partidos' })
  @ApiNotFoundResponse({ description: 'No se encontraron partidos' })
  @Get()
  async findAll() {
    return await this.matchesService.findAll();
  }

  // -------------------------
  //  GET BY ID
  // -------------------------
  @ApiOperation({
    summary: 'Obtener datos del partido por ID',
  })
  @ApiOkResponse({ description: 'Retorna los datos del partido' })
  @ApiNotFoundResponse({ description: 'Partido no encontrado' })
  @ApiParam({
    name: 'id',
    description: 'ID único del partido',
    type: Number,
    example: 1,
  })
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.matchesService.findById(id);
  }

  // -------------------------
  //  CREATE
  // -------------------------
  @ApiBody({ type: CreateMatchDto })
  @ApiOperation({
    summary: 'Crear partido',
  })
  @ApiOkResponse({ description: 'Retorna los datos del partido creado' })
  @ApiBadRequestResponse({
    description: 'No puedes crear un partido contra ti',
  })
  @ApiConflictResponse({
    description: 'Ya existe un partido con esa hora y cancha',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error al crear o actualizar el partido',
  })
  @UseGuards(RolesGuard)
  @Roles(RolesUser.CAPTAIN)
  @Post()
  async create(@Req() req: Request, @Body() dto: CreateMatchDto) {
    const user = req.user;
    return await this.matchesService.create(user, dto);
  }

  // -------------------------
  //  UPDATE
  // -------------------------
  @ApiBody({ type: UpdateMatchDto })
  @ApiOperation({
    summary: 'Actualizar partido',
    description: 'Solo el creador del partido podra actaulizar.',
  })
  @ApiOkResponse({ description: 'Retorna los datos de partido actualizado' })
  @ApiUnauthorizedResponse({
    description: 'No tienes permisos para realizar esta acción',
  })
  @ApiBadRequestResponse({ description: 'Error al actualizar al información' })
  @ApiInternalServerErrorResponse({
    description: 'Error al crear o actualizar el partido',
  })
  @UseGuards(RolesGuard)
  @Roles(RolesUser.CAPTAIN)
  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMatchDto,
  ) {
    const user = req.user;
    return await this.matchesService.update(user, id, dto);
  }

  // -------------------------
  //  CHANGE RESULT
  // -------------------------
  @ApiBody({ type: UpdateMatchDto })
  @ApiOperation({
    summary: 'Cargar resultado',
    description: 'Solo el creador del partido podra cargar el resultado.',
  })
  @ApiOkResponse({ description: 'Resultado actualizado' })
  @ApiBadRequestResponse({ description: 'No se puede cambiar el resultado' })
  @ApiUnauthorizedResponse({
    description: 'No puedes cambiar el resultado del partido',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del partido',
    type: Number,
    example: 1,
  })
  @UseGuards(RolesGuard)
  @Roles(RolesUser.CAPTAIN)
  @Put('result/:id')
  async changeResult(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMatchDto,
  ) {
    const user = req.user;
    return await this.matchesService.changeResult(user, id, dto);
  }

  // -------------------------
  //  CONFIRM RESULT
  // -------------------------
  @ApiOperation({
    summary: 'Confirmar resultado',
    description: 'Solo el capitan del equipo visitante puede confirmar.',
  })
  @ApiOkResponse({ description: 'Resultado confirmado' })
  @ApiUnauthorizedResponse({
    description: 'No tienes autorización para realizar la acción',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del partido',
    type: Number,
    example: 1,
  })
  @UseGuards(RolesGuard)
  @Roles(RolesUser.CAPTAIN)
  @Patch('result/confirm/:id')
  async confirmResult(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user = req.user;
    return await this.matchesService.confirmResult(user, id);
  }

  // -------------------------
  //  REJECT RESULT
  // -------------------------
  @ApiOperation({
    summary: 'Rechazar resultado',
    description: 'Solo el capitan del equipo visitante puede rechazar.',
  })
  @ApiOkResponse({ description: 'Resultado rechazado' })
  @ApiBadRequestResponse({ description: 'No puedes ejecutar la acción' })
  @ApiUnauthorizedResponse({
    description: 'No tienes autorización para realizar la acción',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del partido',
    type: Number,
    example: 1,
  })
  @Patch('result/reject/:id')
  async rejectResult(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user = req.user;
    return await this.matchesService.rejecetResult(user, id);
  }

  // -------------------------
  //  LEAVE MATCH
  // -------------------------
  @ApiOperation({
    summary: 'Salir de un partido',
    description: 'Solo el equipo visitante salir del partido.',
  })
  @ApiOkResponse({ description: 'Has salido del partido correctamente' })
  @ApiInternalServerErrorResponse({
    description: 'Registro de equipos visitante no encontrado',
  })
  @ApiUnauthorizedResponse({
    description: 'No tienes permisos para ejecutar la acción',
  })
  @UseGuards(RolesGuard)
  @Roles(RolesUser.CAPTAIN)
  @Patch('leave/:id')
  async leaveMatch(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const user = req.user;
    return await this.matchesService.leaveMatch(user, id);
  }

  // -------------------------
  //  JOIN MATCH
  // -------------------------
  @ApiOperation({ summary: 'Unirte a un partido' })
  @ApiOkResponse({ description: 'Te uniste al partido correctamente' })
  @ApiBadRequestResponse({
    description:
      'El partido ya tiene dos equipos o el equipo ya está participando en el partido',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del partido',
    type: Number,
    example: 1,
  })
  @UseGuards(RolesGuard)
  @Roles(RolesUser.CAPTAIN)
  @Patch('join/:id')
  async joinMatch(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const user = req.user;
    return await this.matchesService.joinMatch(user, id);
  }

  // -------------------------
  //  REMOVE
  // -------------------------
  @ApiOperation({
    summary: 'Eliminar partido',
    description: 'Solo el creador del partido puede eliminarlo.',
  })
  @ApiOkResponse()
  @ApiUnauthorizedResponse({
    description: 'No tienes permiso para realizar esta acción',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del partido',
    type: Number,
    example: 1,
  })
  @UseGuards(RolesGuard)
  @Roles(RolesUser.CAPTAIN)
  @Delete(':id')
  async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const user = req.user;
    return await this.matchesService.remove(user, id);
  }
}
