import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { FieldEntity } from 'src/modules/fields/entity/field.entity';

@Entity({ name: 'horarios' })
@Unique('unique_schedule_hour_field', ['date_time', 'field'])
export class ScheduleEntity extends BaseEntity {
  @Column({ type: 'timestamp', nullable: false })
  date_time: Date;

  @ManyToOne(() => FieldEntity, (field) => field.schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'field_id' })
  field: FieldEntity;
}