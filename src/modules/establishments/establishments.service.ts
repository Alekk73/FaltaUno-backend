import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstablishmentEntity } from './entities/establishment.entity';
import { Repository } from 'typeorm';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { JwtPayload } from 'src/common/jwt-payload';
@Injectable()
export class EstablishmentsService {
  constructor(
    @InjectRepository(EstablishmentEntity)
    private readonly establishmentRepository: Repository<EstablishmentEntity>,
  ) {}

  async findByUserId(userId: number): Promise<EstablishmentEntity | null> {
    const establishment = await this.establishmentRepository.findOneBy({
      propietario: { id: userId },
    });

    if (!establishment)
      throw new NotFoundException('Establecimiento no encontrado');

    return establishment;
  }

  async create(
    userData: JwtPayload,
    dto: CreateEstablishmentDto,
  ): Promise<EstablishmentEntity> {
    const findNameInUse = await this.establishmentRepository.findOneBy({
      nombre: dto.nombre,
    });

    if (findNameInUse)
      throw new ConflictException('Nombre ingresado ya en uso');

    try {
      const newEst = this.establishmentRepository.create({
        ...dto,
        propietario: { id: userData.id },
      });

      const savedEst = await this.establishmentRepository.save(newEst);
      return savedEst;
    } catch (err) {
      Logger.error('Error creando establecimiento', err);

      throw new InternalServerErrorException('Error en el servidor');
    }
  }
}
