import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { MatchEntity } from './match.entity';

@Entity({ name: 'partidos_equipos' })
export class MatchTeamEntity extends BaseEntity {
  @Column({ type: 'int', nullable: false, default: 0 })
  goles_local: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  goles_visitante: number;

  @ManyToOne(() => MatchEntity, (m) => m.partido_equipos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'partido_id' })
  partido: MatchEntity;
}
