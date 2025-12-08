import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import type { Request } from 'express';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesUser } from 'src/common/enums/roles-user.enum';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  // -------------------------
  //  CREATE
  // -------------------------
  @ApiBody({ type: CreateTeamDto })
  @ApiOperation({ summary: 'Crear equipo' })
  @ApiOkResponse({ description: 'Retorna los datos del equipo creado' })
  @ApiBadRequestResponse({ description: 'Ya tiene un equipo' })
  @ApiConflictResponse({ description: 'Nombre ingresado ya en uso ' })
  @UseGuards(RolesGuard)
  @Roles(RolesUser.USER)
  @Post()
  async create(@Req() req: Request, @Body() dto: CreateTeamDto) {
    const user = req.user;
    return await this.teamsService.create(user, dto);
  }

  // -------------------------
  //  GET ALL
  // -------------------------
  @ApiOperation({ summary: 'Obtener todos los equipos' })
  @ApiOkResponse({ description: 'Retorna arreglo de equipos' })
  @Get()
  async findAll() {
    return await this.teamsService.findAll();
  }

  // -------------------------
  //  GET BY ID
  // -------------------------
  @ApiOperation({ summary: 'Obtener equipo por ID' })
  @ApiOkResponse({ description: 'Obtener datos del equipo solicitado' })
  @ApiNotFoundResponse({ description: 'Equipo no encontrado' })
  @ApiParam({
    name: 'id',
    description: 'ID único del equipo',
    type: Number,
    example: 1,
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.teamsService.findById(+id);
  }

  // -------------------------
  //  UPDATE
  // -------------------------
  @ApiBody({ type: UpdateTeamDto })
  @ApiOperation({
    summary: 'Actualizar datos del equipos',
  })
  @ApiOkResponse({ description: 'Retorna los datos del equipo modificado' })
  @ApiConflictResponse({ description: 'Nombre ingresado ya existente' })
  @UseGuards(RolesGuard)
  @Roles(RolesUser.CAPTAIN)
  @Put()
  async update(@Req() req: Request, @Body() dto: UpdateTeamDto) {
    const user = req.user;
    return await this.teamsService.update(user, dto);
  }

  // -------------------------
  //  DELETE
  // -------------------------
  @ApiOperation({
    summary: 'Eliminar equipo',
  })
  @ApiNotFoundResponse({ description: 'Equipo no encontrado' })
  @ApiForbiddenResponse({
    description: 'Solo el capitán puede eliminar el equipo',
  })
  @ApiOkResponse()
  @UseGuards(RolesGuard)
  @Roles(RolesUser.CAPTAIN)
  @Delete()
  async remove(@Req() req: Request) {
    const user = req.user;
    return await this.teamsService.remove(user);
  }
}
