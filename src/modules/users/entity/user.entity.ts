import { BaseEntity } from '../../../common/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { RolesUser } from '../../../common/enums/roles-user.enum';
import { Exclude } from 'class-transformer';
import { TeamEntity } from '../../../modules/teams/entity/team.entity';
import { InvitationEntity } from '../../../modules/invitations/entities/invitation.entity';
import { TokenEntity } from './token.entity';
import { EstablishmentEntity } from '../../../modules/establishments/entities/establishment.entity';

@Entity({ name: 'usuarios' })
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 50, nullable: false })
  nombre: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  apellido: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  correo_electronico: string;

  @Column({ type: 'varchar', length: 15, nullable: false })
  documento: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255, nullable: false })
  contrasena_hash: string;

  @Column({ type: 'enum', enum: RolesUser, default: RolesUser.USER })
  rol: RolesUser;

  @Column({ type: 'boolean', default: false })
  visible: boolean;

  @Column({ type: 'boolean', default: false })
  verificado: boolean;

  @OneToMany(() => TokenEntity, (token) => token.usuario)
  tokens: TokenEntity[];

  @ManyToOne(() => TeamEntity, (team) => team.usuarios, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'equipo_id' })
  equipo: TeamEntity | null;

  @OneToMany(() => InvitationEntity, (inv) => inv.creador)
  invitaciones: InvitationEntity[];

  @OneToOne(() => EstablishmentEntity, (e) => e.propietario)
  establecimiento: EstablishmentEntity;
}
