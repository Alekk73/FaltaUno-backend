import { BaseEntity } from 'src/common/base.entity';
import { IUser } from '../user.interface';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RolesUser } from 'src/common/enums/roles-user.enum';
import { Exclude } from 'class-transformer';
import { TeamEntity } from 'src/modules/teams/entities/team.entity';

@Entity({ name: 'usuarios' })
export class UserEntity extends BaseEntity implements IUser {
  @Column({ type: 'varchar', length: 50, nullable: false })
  nombre: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  apellido: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  correo_electronico: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255, nullable: false })
  contrasena_hash: string;

  @Column({ type: 'enum', enum: RolesUser, default: RolesUser.usuario })
  rol: RolesUser;

  @ManyToOne(() => TeamEntity, (team) => team.usuarios, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'equipo_id' })
  equipo: TeamEntity | null;
}
