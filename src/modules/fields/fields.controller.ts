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

@Controller('fields')
export class FieldsController {
  constructor(private readonly canchasService: FieldsService) {}

  @UseGuards(RolesGuard)
  @Roles(RolesUser.ADMIN)
  @Post()
  create(@Body() dto: CreateFieldDto) {
    return this.canchasService.create(dto);
  }

  @Get()
  findAll() {
    return this.canchasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.canchasService.findOne(+id);
  }

  @UseGuards(RolesGuard)
  @Roles(RolesUser.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFieldDto) {
    return this.canchasService.update(+id, dto);
  }

  @Delete(':id')
  @Roles(RolesUser.ADMIN)
  remove(@Param('id') id: string) {
    return this.canchasService.remove(+id);
  }
}
