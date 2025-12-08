import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FieldEntity } from './entity/field.entity';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';

@Injectable()
export class FieldsService {
  constructor(
    @InjectRepository(FieldEntity)
    private readonly fieldRepository: Repository<FieldEntity>,
  ) {}

  async create(dto: CreateFieldDto) {
    const cancha = this.fieldRepository.create(dto);
    return await this.fieldRepository.save(cancha);
  }

  async findAll() {
    return await this.fieldRepository.find();
  }

  async findOne(id: number) {
    const cancha = await this.fieldRepository.findOne({
      where: { id },
    });

    if (!cancha) {
      throw new NotFoundException('Cancha no encontrada');
    }

    return cancha;
  }

  async update(id: number, dto: UpdateFieldDto) {
    const cancha = await this.findOne(id);

    Object.assign(cancha, dto);

    return await this.fieldRepository.save(cancha);
  }

  async remove(id: number) {
    const cancha = await this.findOne(id);
    if (!cancha) throw new NotFoundException('Cancha no encontrada');

    return await this.fieldRepository.remove(cancha);
  }
}
