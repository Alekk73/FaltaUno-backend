import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { MatchEntity } from 'src/modules/matches/entities/match.entity';

@Entity({ name: 'horarios' })
@Unique('unique_schedule_hour_match', ['hora_dia', 'match'])
export class ScheduleEntity extends BaseEntity {
  @Column({ type: 'timestamp', nullable: false })
  hora_dia: Date;

  @ManyToOne(() => MatchEntity, (match) => match.schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'match_id' })
  match: MatchEntity;
}
