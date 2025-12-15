import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EstablishmentsService } from './establishments.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesUser } from 'src/common/enums/roles-user.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/common/jwt-payload';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';

@Controller('establishments')
export class EstablishmentsController {
  constructor(private readonly establishmentsService: EstablishmentsService) {}

  @UseGuards(RolesGuard)
  @Roles(RolesUser.OWNER)
  @Post()
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateEstablishmentDto,
  ) {
    return await this.establishmentsService.create(user, dto);
  }
}
