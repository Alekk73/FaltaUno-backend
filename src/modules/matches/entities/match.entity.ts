import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { MatchTeamEntity } from './match-team.entity';

@Entity({ name: 'partidos' })
export class MatchEntity extends BaseEntity {
  @Column({ type: 'timestamp', nullable: false })
  hora_dia: Date;

  @OneToMany(() => MatchTeamEntity, (mt) => mt.partido)
  partido_equipos: MatchTeamEntity[];
}
