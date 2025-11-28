import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  Delete,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import type { Request } from 'express';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // -------------------------
  //  GET BY EMAIL
  // -------------------------
  @ApiOperation({ summary: 'Obtener usuario por email' })
  @ApiOkResponse({ description: 'Retorna los datos del usuario' })
  @ApiNotFoundResponse({
    description: 'Usuario con email solicitado no encontrado',
  })
  @Get('email/:email')
  @HttpCode(HttpStatus.OK)
  async findByEmail(@Param('email') email: string) {
    return await this.usersService.findByEmail(email);
  }

  // -------------------------
  //  UPDATE
  // -------------------------
  @ApiOperation({ summary: 'Actualizar datos del usuario' })
  @ApiOkResponse({ description: 'Retorna los datos del usuario actualizado' })
  @ApiConflictResponse({ description: 'El email ingresado ya está en uso' })
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(id, updateUserDto);
  }

  // -------------------------
  //  DELETE
  // -------------------------
  @ApiOperation({ summary: 'Eliminar usuario logeado' })
  @ApiOkResponse({ description: 'Usuario eliminado correctamente' })
  @Delete()
  @HttpCode(HttpStatus.OK)
  async remove(@Req() req: Request) {
    const user = req.user;
    return await this.usersService.remove(user.id);
  }
}
