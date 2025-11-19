import { Controller, Get, Post, Body, Param, Delete, Put } from "@nestjs/common";
import { CanchasService } from "./canchas.service";
import { CreateCanchaDto } from "./dto/create-cancha.dto";
import { UpdateCanchaDto } from "./dto/update-cancha.dto";

@Controller("canchas")
export class CanchasController {
  constructor(private readonly canchasService: CanchasService) {}

  @Post()
  create(@Body() dto: CreateCanchaDto) {
    return this.canchasService.create(dto);
  }

  @Get()
  findAll() {
    return this.canchasService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.canchasService.findOne(+id);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateCanchaDto
  ) {
    return this.canchasService.update(+id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.canchasService.remove(+id);
  }
}
