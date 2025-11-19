import { Injectable, NotFoundException,} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cancha } from "./cancha.entity";
import { CreateCanchaDto } from "./dto/create-cancha.dto";
import { UpdateCanchaDto } from "./dto/update-cancha.dto";

@Injectable()
export class CanchasService {
  constructor(
    @InjectRepository(Cancha)
    private readonly canchaRepository: Repository<Cancha>,
  ) {}

  async create(dto: CreateCanchaDto) {
    const cancha = this.canchaRepository.create(dto);
    return await this.canchaRepository.save(cancha);
  }

  async findAll() {
    return await this.canchaRepository.find();
  }

  async findOne(id: number) {
    const cancha = await this.canchaRepository.findOne({
      where: { id },
    });

    if (!cancha) {
      throw new NotFoundException("Cancha no encontrada");
    }

    return cancha;
  }

  async update(id: number, dto: UpdateCanchaDto) {
    const cancha = await this.findOne(id);

    Object.assign(cancha, dto);

    return await this.canchaRepository.save(cancha);
  }

  async remove(id: number) {
    const cancha = await this.findOne(id);
//falta games

    return await this.canchaRepository.remove(cancha);
  }
}
