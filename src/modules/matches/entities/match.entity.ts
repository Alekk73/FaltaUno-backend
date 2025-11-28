import { BaseEntity } from 'src/common/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { MatchTeamEntity } from './match-team.entity';
import { FieldEntity } from 'src/modules/fields/entity/field.entity';
import { MatchStatusResult } from 'src/common/enums/match-status-result.enum';
import { ScheduleEntity } from 'src/modules/schedules/entity/schedule.entity';

@Entity({ name: 'partidos' })
// Se le da un nombre al UNIQUE compuesto se cree bien y se pueda lanzar el error 23505 cuando hay duplicados
@Unique('unique_match_hour_field', ['hora_dia', 'cancha'])
export class MatchEntity extends BaseEntity {
  @Column({ type: 'timestamp', nullable: false })
  hora_dia: Date;

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

  // Relación con el horario
  @OneToMany(() => ScheduleEntity, (schedule) => schedule.match)
  schedules: ScheduleEntity[] | null;
}
