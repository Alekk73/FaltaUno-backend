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

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  // Crear un nuevo equipo
  @UseGuards(RolesGuard)
  @Roles(RolesUser.usuario)
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
  @UseGuards(RolesGuard)
  @Roles(RolesUser.capitan)
  @Put()
  async update(@Req() req: Request, @Body() dto: UpdateTeamDto) {
    const user = req.user;
    return await this.teamsService.update(user, dto);
  }

  // Eliminar equipo
  @UseGuards(RolesGuard)
  @Roles(RolesUser.capitan)
  @Delete()
  async remove(@Req() req: Request) {
    const user = req.user;
    return await this.teamsService.remove(user);
  }
}
