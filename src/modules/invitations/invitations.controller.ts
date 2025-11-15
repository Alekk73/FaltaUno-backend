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
  Put,
  ParseIntPipe,
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

  @Get()
  async findPendingInvitationsForUser(@Req() req: Request) {
    const user = req.user;
    return await this.invitationsService.findPendingInvitationsForUser(user);
  }

  @UseGuards(RolesGuard)
  @Roles(RolesUser.capitan)
  @Post()
  async create(@Req() req: Request, @Body() dto: CreateInvitationDto) {
    const user = req.user;
    return await this.invitationsService.create(user, dto);
  }

  @Put('accept/:id')
  async acceptInvitation(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user = req.user;
    return await this.invitationsService.acceptInvitation(user, id);
  }

  @Put('reject/:id')
  async rejectInvitation(@Param('id', ParseIntPipe) id: number) {
    return await this.invitationsService.rejectInvitation(id);
  }
}
