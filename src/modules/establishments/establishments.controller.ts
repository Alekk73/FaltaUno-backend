import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EstablishmentsService } from './establishments.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesUser } from 'src/common/enums/roles-user.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/common/jwt-payload';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';

@Controller('establishments')
export class EstablishmentsController {
  constructor(private readonly establishmentsService: EstablishmentsService) {}

  // -------------------------
  //  FIND BY NAME
  // -------------------------
  @Get(':slug')
  async findByName(@Param('slug') slug: string) {
    return await this.establishmentsService.findByName(slug);
  }

  // -------------------------
  //  FIND ALL
  // -------------------------
  @Get()
  async findAll() {
    return await this.establishmentsService.findAll();
  }

  // -------------------------
  //  CREATE
  // -------------------------
  @UseGuards(RolesGuard)
  @Roles(RolesUser.OWNER)
  @Post()
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateEstablishmentDto,
  ) {
    return await this.establishmentsService.create(user, dto);
  }

  // -------------------------
  //  UPDATE
  // -------------------------
  @UseGuards(RolesGuard)
  @Roles(RolesUser.OWNER)
  @Put()
  async update(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateEstablishmentDto,
  ) {
    return await this.establishmentsService.update(user, dto);
  }

  // -------------------------
  //  REMOVE
  // -------------------------
  @UseGuards(RolesGuard)
  @Roles(RolesUser.OWNER)
  @Delete()
  async remove(@CurrentUser() user: JwtPayload) {
    return await this.establishmentsService.remove(user);
  }
}
