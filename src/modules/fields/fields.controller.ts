import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FieldsService } from './fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesUser } from '../../common/enums/roles-user.enum';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('fields')
export class FieldsController {
  constructor(private readonly canchasService: FieldsService) {}

  // -------------------------
  //  CREATE
  // -------------------------
  @ApiOperation({ summary: 'Crear cancha - ADMIN' })
  @ApiOkResponse({ description: 'Retorna la cancha creada' })
  @ApiConflictResponse({
    description: 'Nombre de cancha ingresado ya existente',
  })
  @UseGuards(RolesGuard)
  @Roles(RolesUser.ADMIN)
  @Post()
  create(@Body() dto: CreateFieldDto) {
    return this.canchasService.create(dto);
  }

  // -------------------------
  //  FIND ALL
  // -------------------------
  @Get()
  @ApiOperation({ summary: 'Obtener todas las canchas' })
  @ApiOkResponse({ description: 'Retorna la lista de canchas' })
  findAll() {
    return this.canchasService.findAll();
  }

  // -------------------------
  //  FIND BY ID
  // -------------------------
  @ApiOperation({ summary: 'Obtener cancha por ID' })
  @ApiOkResponse({ description: 'Retorna la cancha solicitada' })
  @ApiNotFoundResponse({ description: 'Cancha no encontrada' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.canchasService.findOne(+id);
  }

  // -------------------------
  //  UPDATE
  // -------------------------
  @ApiOperation({ summary: 'Actualizar cancha por ID - ADMIN' })
  @ApiOkResponse({ description: 'Retorna los datos de la cancha actualizada' })
  @ApiNotFoundResponse({ description: 'Cancha no encontrada' })
  @UseGuards(RolesGuard)
  @Roles(RolesUser.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFieldDto) {
    return this.canchasService.update(+id, dto);
  }

  // -------------------------
  //  REMOVE
  // -------------------------
  @ApiOperation({ summary: 'Eliminar cancha por ID - ADMIN' })
  @ApiOkResponse()
  @ApiNotFoundResponse({ description: 'Cancha no encontrada' })
  @Delete(':id')
  @Roles(RolesUser.ADMIN)
  remove(@Param('id') id: string) {
    return this.canchasService.remove(+id);
  }
}
