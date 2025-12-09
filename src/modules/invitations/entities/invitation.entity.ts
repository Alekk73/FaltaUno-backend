import { BaseEntity } from '../../../common/base.entity';
import { StatusInvitation } from '../../../common/enums/status-invitation.enum';
import { TeamEntity } from '../../../modules/teams/entity/team.entity';
import { UserEntity } from '../../../modules/users/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'invitaciones' })
export class InvitationEntity extends BaseEntity {
  @Column({
    type: 'enum',
    enum: StatusInvitation,
    default: StatusInvitation.PENDING,
  })
  estado: StatusInvitation;

  @ManyToOne(() => UserEntity, (user) => user.invitaciones)
  @JoinColumn({ name: 'creador_id' })
  creador: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.invitaciones)
  @JoinColumn({ name: 'invitado_id' })
  invitado: UserEntity;

  @ManyToOne(() => TeamEntity, (team) => team.invitaciones, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'equipo_id' })
  equipo: TeamEntity;
}
