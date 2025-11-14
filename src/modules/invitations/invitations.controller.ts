import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import type { Request } from 'express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesUser } from 'src/common/enums/roles-user.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @UseGuards(RolesGuard)
  @Roles(RolesUser.capitan)
  @Post()
  async create(@Req() req: Request, @Body() dto: CreateInvitationDto) {
    const user = req.user;
    return await this.invitationsService.create(user, dto);
  }
}
