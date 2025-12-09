import { BaseEntity } from '../../../common/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { MatchEntity } from './match.entity';
import { TeamEntity } from '../../../modules/teams/entity/team.entity';

@Entity({ name: 'partidos_equipos' })
export class MatchTeamEntity extends BaseEntity {
  @Column({ type: 'int', nullable: true, default: null })
  goles_local: number | null;

  @Column({ type: 'int', nullable: true, default: null })
  goles_visitante: number | null;

  @Column({ type: 'boolean', default: false })
  es_local: boolean;

  @ManyToOne(() => MatchEntity, (m) => m.equipos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'partido_id' })
  partido: MatchEntity;

  @ManyToOne(() => TeamEntity, (team) => team.partido, { nullable: true })
  @JoinColumn({ name: 'equipo_id' })
  equipo: TeamEntity | null;
}
