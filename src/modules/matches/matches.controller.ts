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
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import type { Request } from 'express';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  async findAll() {
    return await this.matchesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.matchesService.findById(id);
  }

  @Post()
  async create(@Req() req: Request, @Body() dto: CreateMatchDto) {
    const user = req.user;
    return await this.matchesService.create(user, dto);
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const user = req.user;
    return await this.matchesService.remove(user, id);
  }
}
