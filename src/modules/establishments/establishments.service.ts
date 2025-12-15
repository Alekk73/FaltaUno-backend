import {
  BadRequestException,
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
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { slugify } from 'src/common/slugify';
@Injectable()
export class EstablishmentsService {
  constructor(
    @InjectRepository(EstablishmentEntity)
    private readonly establishmentRepository: Repository<EstablishmentEntity>,
  ) {}

  async findByName(slug: string): Promise<EstablishmentEntity | null> {
    const est = await this.establishmentRepository.findOneBy({ slug });
    if (!est) throw new NotFoundException('Establecimiento no encontrado');

    return est;
  }

  async findAll(): Promise<EstablishmentEntity[] | null> {
    const ests = await this.establishmentRepository.find();

    if (ests.length === 0)
      throw new NotFoundException('No se encontraron establecimientos');

    return ests;
  }

  async findByUserId(userId: number): Promise<EstablishmentEntity | null> {
    const establishment = await this.establishmentRepository.findOneBy({
      propietario: { id: userId },
    });

    if (!establishment)
      throw new NotFoundException('Establecimiento no encontrado');

    return establishment;
  }

  async findById(id: number): Promise<EstablishmentEntity | null> {
    const est = await this.establishmentRepository.findOneBy({ id });
    if (!est) throw new NotFoundException('Establecimiento no encontrado');

    return est;
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
      const estNameSlug = slugify(dto.nombre);
      const newEst = this.establishmentRepository.create({
        ...dto,
        slug: estNameSlug,
        propietario: { id: userData.id },
      });

      const savedEst = await this.establishmentRepository.save(newEst);
      return savedEst;
    } catch (err) {
      Logger.error('Error creando establecimiento', err);

      throw new InternalServerErrorException('Error en el servidor');
    }
  }

  async update(
    userData: JwtPayload,
    dto: UpdateEstablishmentDto,
  ): Promise<EstablishmentEntity | null> {
    const est = (await this.findByUserId(userData.id)) as EstablishmentEntity;

    if (
      dto.nombre == null &&
      dto.direccion == null &&
      dto.valor_canchas == null
    )
      throw new BadRequestException(
        'Al menos uno de los campos debe ser completado',
      );

    let estUpdateSlug = est.slug;

    if (dto.nombre != null) estUpdateSlug = slugify(dto.nombre);

    const updateData: Partial<EstablishmentEntity> = {
      slug: estUpdateSlug,
    };

    if (dto.nombre != null) updateData.nombre = dto.nombre;
    if (dto.direccion != null) updateData.direccion = dto.direccion;
    if (dto.valor_canchas != null) updateData.valor_canchas = dto.valor_canchas;

    try {
      await this.establishmentRepository.update(est.id, updateData);

      return await this.findById(est.id);
    } catch (error) {
      Logger.error('Error al actualizar el establecimiento', error);

      throw new InternalServerErrorException('Error en el servidor');
    }
  }

  async remove(userData: JwtPayload): Promise<{ message: string }> {
    const est = (await this.findByUserId(userData.id)) as EstablishmentEntity;

    try {
      await this.establishmentRepository.remove(est);

      return { message: 'Establecimiento eliminado correctamente' };
    } catch (error) {
      Logger.error('Error al eliminar establecimiento', error);

      throw new InternalServerErrorException('Error en el servidor');
    }
  }
}
