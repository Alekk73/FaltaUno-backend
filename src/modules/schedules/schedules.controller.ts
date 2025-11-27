import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Put,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesUser } from 'src/common/enums/roles-user.enum';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  async findAll() {
    return await this.schedulesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.schedulesService.findById(id);
  }

  // SOLO ADMIN
  @UseGuards(RolesGuard)
  @Roles(RolesUser.admin)
  @Post()
  async create(@Body() dto: CreateScheduleDto) {
    return await this.schedulesService.create(dto);
  }

  @UseGuards(RolesGuard)
  @Roles(RolesUser.admin)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateScheduleDto,
  ) {
    return await this.schedulesService.update(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(RolesUser.admin)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.schedulesService.remove(id);
  }
}