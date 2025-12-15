import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FieldEntity } from './entity/field.entity';
import { UpdateFieldDto } from './dto/update-field.dto';
import { JwtPayload } from 'src/common/jwt-payload';
import { EstablishmentsService } from '../establishments/establishments.service';

@Injectable()
export class FieldsService {
  constructor(
    @InjectRepository(FieldEntity)
    private readonly fieldRepository: Repository<FieldEntity>,

    private readonly establishmentService: EstablishmentsService,
  ) {}

  async create(userData: JwtPayload) {
    const establishment = await this.establishmentService.findByUserId(
      userData.id,
    );
    const findCanchasForEstablishment = await this.findForEstablishment(
      establishment?.id as number,
    );

    const latestField =
      findCanchasForEstablishment[findCanchasForEstablishment.length - 1];
    let newField: FieldEntity | null = null;

    if (!latestField) {
      newField = this.fieldRepository.create({
        establecimiento: { id: establishment?.id },
        numero_cancha: 1,
      });
      await this.fieldRepository.save(newField);
    } else {
      newField = this.fieldRepository.create({
        establecimiento: { id: establishment?.id },
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
      relations: ['establecimiento', 'establecimiento.propietario'],
    });

    if (!cancha) {
      throw new NotFoundException('Cancha no encontrada');
    }

    return cancha;
  }

  async findForEstablishment(estId: number) {
    return await this.fieldRepository.find({
      where: { establecimiento: { id: estId } },
    });
  }

  async update(userId: number, id: number, dto: UpdateFieldDto) {
    const cancha = await this.findOne(id);

    if (!cancha)
      throw new NotFoundException('Cancha a actualizar no encontrada');

    if (cancha.establecimiento.propietario.id !== userId)
      throw new UnauthorizedException(
        'No tienes permiso para modificar la cancha',
      );

    Object.assign(cancha, dto);

    return await this.fieldRepository.save(cancha);
  }

  async remove(userId: number, id: number) {
    const cancha = await this.findOne(id);

    if (!cancha) throw new NotFoundException('Cancha no encontrada');

    if (cancha.establecimiento.propietario.id !== userId)
      throw new UnauthorizedException(
        'No tienes permiso para eliminar la cancha',
      );

    await this.fieldRepository.remove(cancha);

    return { message: 'Cancha eliminada correctamente' };
  }
}
