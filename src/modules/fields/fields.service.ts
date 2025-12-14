import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FieldEntity } from './entity/field.entity';
import { UpdateFieldDto } from './dto/update-field.dto';
import { JwtPayload } from 'src/common/jwt-payload';

@Injectable()
export class FieldsService {
  constructor(
    @InjectRepository(FieldEntity)
    private readonly fieldRepository: Repository<FieldEntity>,
  ) {}

  async create(userData: JwtPayload) {
    const findCancha = await this.findAll();

    const latestField = findCancha[findCancha.length - 1];
    let newField: FieldEntity | null = null;

    if (!latestField) {
      newField = this.fieldRepository.create({
        numero_cancha: 1,
      });
      await this.fieldRepository.save(newField);
    } else {
      newField = this.fieldRepository.create({
        numero_cancha: latestField.numero_cancha + 1,
      });
    }

    return await this.fieldRepository.save(newField);
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

    if (!cancha)
      throw new NotFoundException('Cancha a actualizar no encontrada');

    Object.assign(cancha, dto);

    return await this.fieldRepository.save(cancha);
  }

  async remove(id: number) {
    const cancha = await this.findOne(id);
    if (!cancha) throw new NotFoundException('Cancha no encontrada');

    return await this.fieldRepository.remove(cancha);
  }
}
