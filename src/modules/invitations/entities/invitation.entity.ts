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
