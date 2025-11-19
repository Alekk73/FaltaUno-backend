import { BaseEntity } from 'src/common/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity({ name: 'canchas' })
export class FieldEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;
}
