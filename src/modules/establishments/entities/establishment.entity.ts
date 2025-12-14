import { FieldEntity } from '../../../modules/fields/entity/field.entity';
import { BaseEntity } from '../../../common/base.entity';
import { UserEntity } from '../../../modules/users/entity/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity({ name: 'establecimientos' })
export class EstablishmentEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  nombre: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @OneToOne(() => UserEntity, (user) => user.establecimiento)
  @JoinColumn({ name: 'usuario_id' })
  propietario: UserEntity;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  direccion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor_canchas: number;

  @OneToMany(() => FieldEntity, (field) => field.establecimiento)
  canchas: FieldEntity[];
}
