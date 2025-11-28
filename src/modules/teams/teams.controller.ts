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
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  // -------------------------
  //  CREATE
  // -------------------------
  @ApiOperation({ summary: 'Crear equipo' })
  @ApiOkResponse({ description: 'Retorna los datos del equipo creado' })
  @ApiBadRequestResponse({ description: 'Ya tiene un equipo' })
  @ApiConflictResponse({ description: 'Nombre ingresado ya en uso ' })
  @UseGuards(RolesGuard)
  @Roles(RolesUser.usuario)
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
  @ApiOperation({ summary: 'Obtener equipo por identificador' })
  @ApiOkResponse({ description: 'Obtener datos del equipo solicitado' })
  @ApiNotFoundResponse({ description: 'Equipo no encontrado' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.teamsService.findById(+id);
  }

  // -------------------------
  //  UPDATE
  // -------------------------
  @ApiOperation({
    summary:
      'Actualizar datos del equipos del usuario logeado, siempre que sea el capitan',
  })
  @ApiOkResponse({ description: 'Retorna los datos del equipo modificado' })
  @ApiConflictResponse({ description: 'Nombre ingresado ya existente' })
  @UseGuards(RolesGuard)
  @Roles(RolesUser.capitan)
  @Put()
  async update(@Req() req: Request, @Body() dto: UpdateTeamDto) {
    const user = req.user;
    return await this.teamsService.update(user, dto);
  }

  // -------------------------
  //  DELETE
  // -------------------------
  @ApiOperation({
    summary: 'Eliminar equipo del usuario logeado, siempre que sea capitan',
  })
  @ApiNotFoundResponse({ description: 'Equipo no encontrado' })
  @ApiForbiddenResponse({
    description: 'Solo el capitán puede eliminar el equipo',
  })
  @ApiOkResponse()
  @UseGuards(RolesGuard)
  @Roles(RolesUser.capitan)
  @Delete()
  async remove(@Req() req: Request) {
    const user = req.user;
    return await this.teamsService.remove(user);
  }
}
