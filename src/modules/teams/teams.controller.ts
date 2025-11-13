import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  // Crear un nuevo equipo
  @Post(':userId')
  create(@Param('userId') userId: string, @Body() dto: CreateTeamDto) {
    return this.teamsService.create(dto, +userId);
  }

  // Obtener todos los equipos
  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  // Buscar equipo por ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(+id);
  }

  // Actualizar equipo
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTeamDto) {
    return this.teamsService.update(+id, dto);
  }

  // Eliminar equipo
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamsService.remove(+id);
  }
}
