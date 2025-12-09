import { BaseEntity } from '../../../common/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { MatchTeamEntity } from './match-team.entity';
import { FieldEntity } from '../../../modules/fields/entity/field.entity';
import { MatchStatusResult } from '../../../common/enums/match-status-result.enum';

@Entity({ name: 'partidos' })
@Unique('unique_match_hour_field', ['hora_dia', 'cancha'])
export class MatchEntity extends BaseEntity {
  @Column({ type: 'timestamp', nullable: true })
  hora_dia: Date | null;

  @Column({
    type: 'enum',
    enum: MatchStatusResult,
    default: MatchStatusResult.SIN_CARGAR,
  })
  estado_resultado: MatchStatusResult;

  @OneToMany(() => MatchTeamEntity, (mt) => mt.partido)
  equipos: MatchTeamEntity[];

  @ManyToOne(() => FieldEntity, (field) => field.partidos)
  @JoinColumn({ name: 'cancha_id' })
  cancha: FieldEntity;
}
