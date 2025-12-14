import { EstablishmentEntity } from '../../../modules/establishments/entities/establishment.entity';
import { BaseEntity } from '../../../common/base.entity';
import { MatchEntity } from '../../../modules/matches/entities/match.entity';
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'canchas' })
@Unique('unique_field_est', ['numero_cancha', 'establecimiento'])
export class FieldEntity extends BaseEntity {
  @Column({ type: 'int' })
  numero_cancha: number;

  @OneToMany(() => MatchEntity, (match) => match.cancha)
  partidos: MatchEntity[];

  @ManyToOne(() => EstablishmentEntity, (e) => e.canchas)
  @JoinColumn({ name: 'establecimiento_id' })
  establecimiento: EstablishmentEntity;
}
