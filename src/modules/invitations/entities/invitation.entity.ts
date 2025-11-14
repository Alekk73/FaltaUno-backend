import { BaseEntity } from 'src/common/base.entity';
import { StatusInvitation } from 'src/common/enums/status-invitation.enum';
import { TeamEntity } from 'src/modules/teams/entities/team.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'invitaciones' })
export class InvitationEntity extends BaseEntity {
  @Column({
    type: 'enum',
    enum: StatusInvitation,
    default: StatusInvitation.PENDING,
  })
  estado: StatusInvitation;

  @ManyToOne(() => UserEntity, (user) => user.invitations)
  @JoinColumn({ name: 'creador_id' })
  creator: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.invitations)
  @JoinColumn({ name: 'invitado_id' })
  guest: UserEntity;

  @ManyToOne(() => TeamEntity, (team) => team.invitations)
  @JoinColumn({ name: 'equipo_id' })
  team: TeamEntity;
}
