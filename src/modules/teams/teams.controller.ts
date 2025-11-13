import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import type { Request } from 'express';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  // Crear un nuevo equipo
  @Post()
  async create(@Req() req: Request, @Body() dto: CreateTeamDto) {
    const user = req.user;
    return await this.teamsService.create(user, dto);
  }

  // Obtener todos los equipos
  @Get()
  async findAll() {
    return await this.teamsService.findAll();
  }

  // Buscar equipo por ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.teamsService.findById(+id);
  }

  // Actualizar equipo
  @Put()
  async update(@Req() req: Request, @Body() dto: UpdateTeamDto) {
    const user = req.user;
    return await this.teamsService.update(user, dto);
  }

  // Eliminar equipo
  @Delete()
  async remove(@Req() req: Request) {
    const user = req.user;
    return await this.teamsService.remove(user);
  }
}
