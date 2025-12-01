import { BaseEntity } from 'src/common/base.entity';
import { 
  Column, 
  Entity, 
  OneToMany,  
  Unique 
} from 'typeorm';
import { MatchEntity } from 'src/modules/matches/entities/match.entity';

@Entity({ name: 'horarios' })
@Unique('unique_schedule_hour', ['hora_dia']) 
export class ScheduleEntity extends BaseEntity {
  @Column({ type: 'date', nullable: false }) 
  hora_dia: Date;

  @Column({ type: 'boolean', default: true, name: 'esta_activo' })
  esta_activo: boolean;

  @OneToMany(() => MatchEntity, (match) => match.horario)
  partidos: MatchEntity[];
}