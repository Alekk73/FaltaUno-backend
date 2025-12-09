import { BaseEntity } from '../../../common/base.entity';
import { MatchEntity } from '../../../modules/matches/entities/match.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity({ name: 'canchas' })
export class FieldEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  @OneToMany(() => MatchEntity, (match) => match.cancha)
  partidos: MatchEntity[];
}
