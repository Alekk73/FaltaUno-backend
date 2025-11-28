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
      relations: ['match'],
    });
  }

  async findById(id: number) {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['match'],
    });

    if (!schedule) {
      throw new NotFoundException('Horario no encontrado');
    }

    return schedule;
  }

  async create(dto: CreateScheduleDto) {
    const date = new Date(dto.hora_dia);

    // Verifica conflicto de horario por match + hora
    const conflict = await this.scheduleRepository.findOne({
      where: {
        match: { id: dto.matchId },
        hora_dia: date,
      },
    });

    if (conflict) {
      throw new ConflictException(
        'Ya existe un horario asignado a ese partido en ese momento',
      );
    }

    const schedule = this.scheduleRepository.create({
      hora_dia: date,
      match: { id: dto.matchId },
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

    const newDate = dto.hora_dia ? new Date(dto.hora_dia) : schedule.hora_dia;
    const newMatchId = dto.matchId ?? schedule.match.id;

    // Conflicto al actualizar
    const conflict = await this.scheduleRepository.findOne({
      where: {
        match: { id: newMatchId },
        hora_dia: newDate,
      },
    });

    if (conflict && conflict.id !== schedule.id) {
      throw new ConflictException(
        'Ya existe un horario asignado a ese partido en ese momento',
      );
    }

    if (dto.hora_dia) schedule.hora_dia = new Date(dto.hora_dia);
    if (dto.matchId) schedule.match = { id: dto.matchId } as any;

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

  private handleSaveError(error: any) {
    if (error.code === '23505') {
      throw new ConflictException(
        'Ya existe un horario para ese partido y hora',
      );
    }
    throw new BadRequestException('Error al guardar el horario');
  }
}
