import { BaseEntity } from 'src/common/base.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { Column, Entity, OneToMany, OneToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'equipos' })
export class TeamEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 75, nullable: false })
  nombre: string;

 
  @OneToMany(() => UserEntity, (user) => user.equipo)
  usuarios: UserEntity[];

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'owner_id' })
  owner: UserEntity;
}
