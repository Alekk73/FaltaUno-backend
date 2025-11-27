import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleEntity } from './entity/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
  ) {}

  async findAll() {
    return await this.scheduleRepository.find({
      relations: ['field'],
    });
  }

  async findById(id: number) {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['field'],
    });

    if (!schedule) {
      throw new NotFoundException('Horario no encontrado');
    }

    return schedule;
  }

  async create(dto: CreateScheduleDto) {
    const date = new Date(dto.date_time);
      // Verifica conflicto de horario
    const conflict = await this.scheduleRepository.findOne({
  where: {
    field: { id: dto.fieldId },
    date_time: date,
  },
});

if (conflict) {
  throw new ConflictException(
    'Ya existe un horario asignado a esa cancha en ese momento',
  );
}

    const schedule = this.scheduleRepository.create({
      date_time: date,
      field: { id: dto.fieldId },
    });

    try {
      await this.scheduleRepository.save(schedule);
      return await this.findById(schedule.id);
    } catch (error) {
      this.handleSaveError(error);
    }
  }

async update(id: number, dto: UpdateScheduleDto) {
    const schedule = await this.findById(id);
      //Valida conflicto de horario
  const newDate = dto.date_time ? new Date(dto.date_time) : schedule.date_time;
  const newFieldId = dto.fieldId ?? schedule.field.id;

  const conflict = await this.scheduleRepository.findOne({
  where: {
    field: { id: newFieldId },
    date_time: newDate,
  },
});

// Si existe otro horario con misma fecha/cancha → error
if (conflict && conflict.id !== schedule.id) {
  throw new ConflictException(
    'Ya existe un horario asignado a esa cancha en ese momento',
  );
}

    if (dto.date_time) schedule.date_time = new Date(dto.date_time);
    if (dto.fieldId) schedule.field = { id: dto.fieldId } as any;

    try {
      await this.scheduleRepository.save(schedule);
      return await this.findById(schedule.id);
    } catch (error) {
      this.handleSaveError(error);
    }
  }

  async remove(id: number) {
    const schedule = await this.findById(id);
    await this.scheduleRepository.remove(schedule);
  }

  //  Metodo privado

  private handleSaveError(error: any) {
    if (error.code === '23505') {
      throw new ConflictException(
        'Ya existe un horario para esa cancha y hora',
      );
    }
    throw new BadRequestException('Error al guardar el horario');
  }
}