import { BaseEntity } from 'src/common/base.entity';
import { MatchEntity } from 'src/modules/matches/entities/match.entity';
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';

@Entity({ name: 'canchas' })
export class FieldEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  @OneToMany(() => MatchEntity, (match) => match.cancha)
  partidos: MatchEntity[];
}
