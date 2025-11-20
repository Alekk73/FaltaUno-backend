import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { FieldsService } from './fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';

@Controller('fields')
export class FieldsController {
  constructor(private readonly canchasService: FieldsService) {}

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

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFieldDto) {
    return this.canchasService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.canchasService.remove(+id);
  }
}
