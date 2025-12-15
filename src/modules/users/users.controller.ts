import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  HttpStatus,
  HttpCode,
  Delete,
  Req,
  Patch,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import type { Request } from 'express';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { TeamsService } from '../teams/teams.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RolesUser } from 'src/common/enums/roles-user.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly teamService: TeamsService,
  ) {}

  // -------------------------
  //  GET BY EMAIL
  // -------------------------
  @ApiOperation({ summary: 'Obtener usuario por email' })
  @ApiOkResponse({ description: 'Retorna los datos del usuario' })
  @ApiNotFoundResponse({
    description: 'Usuario con email solicitado no encontrado',
  })
  @ApiParam({
    name: 'email',
    description: 'email del usuario',
    type: String,
    example: 'pepeargento@mail.com',
  })
  @Get('email/:email')
  @HttpCode(HttpStatus.OK)
  async findByEmail(@Param('email') email: string) {
    return await this.usersService.findByEmail(email);
  }

  // -------------------------
  //  GET AVAILABLES
  // -------------------------
  @ApiOperation({ summary: 'Obtener la lista de usuarios disponibles' })
  @ApiOkResponse({ description: 'Retorna la lista de usuarios' })
  @ApiNotFoundResponse({ description: 'No existen usuarios libres' })
  @Get('available')
  async findAvailableUsers() {
    return await this.usersService.findAvailableUsers();
  }

  // -------------------------
  //  UPDATE
  // -------------------------
  @ApiOperation({ summary: 'Actualizar datos del usuario' })
  @ApiOkResponse({ description: 'Retorna los datos del usuario actualizado' })
  @ApiConflictResponse({ description: 'El email ingresado ya está en uso' })
  @Put()
  @HttpCode(HttpStatus.OK)
  async update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const user = req.user;
    return await this.usersService.update(user.id, updateUserDto);
  }

  // -------------------------
  //  DELETE
  // -------------------------
  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiOkResponse({ description: 'Usuario eliminado correctamente' })
  @Delete()
  @HttpCode(HttpStatus.OK)
  async remove(@Req() req: Request) {
    const user = req.user;
    return await this.usersService.remove(user.id);
  }

  // -------------------------
  //  CHANGE VISIBILITY
  // -------------------------
  @ApiOperation({
    summary: 'Cambiar visibilidad del usuario',
  })
  @ApiOkResponse({ description: 'Cambio de visibilidad realizado' })
  @ApiBadRequestResponse({
    description: 'No puedes cambiar tu visibilidad de usuario',
  })
  @Patch('change-visibility')
  async changeVisibility(@Req() req: Request) {
    const user = req.user;
    return await this.usersService.changeVisibility(user);
  }

  // -------------------------
  //  LEAVE TEAM
  // -------------------------
  @ApiOperation({ summary: 'Salir del equipo' })
  @ApiOkResponse({ description: 'Saliste de equipo correctamente' })
  @ApiBadRequestResponse({
    description: 'El capitan no puede salir del equipo',
  })
  @Patch('leave-team')
  async leaveTeam(@Req() req: Request) {
    const user = req.user;
    return await this.teamService.leaveTeam(user);
  }

  // -------------------------
  //  CONVERT TO OWNER
  // -------------------------
  @ApiOperation({ summary: 'Convertir usuario a propietario' })
  @ApiOkResponse({ description: 'Rol propietario asignado correctamente' })
  @ApiNotFoundResponse({
    description: 'Usuario no encontrado',
  })
  @UseGuards(RolesGuard)
  @Roles(RolesUser.ADMIN)
  @Patch('to-owner/:id')
  async convertUserToOwner(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.convertUserToOwner(id);
  }
}
