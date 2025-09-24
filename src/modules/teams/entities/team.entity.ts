import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'teams' })
export class TeamEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 75, nullable: false })
  nombre: string;
}