import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { MatchEntity } from './match.entity';
import { TeamEntity } from 'src/modules/teams/entities/team.entity';

@Entity({ name: 'partidos_equipos' })
export class MatchTeamEntity extends BaseEntity {
  @Column({ type: 'int', nullable: false, default: 0 })
  goles_local: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  goles_visitante: number;

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
