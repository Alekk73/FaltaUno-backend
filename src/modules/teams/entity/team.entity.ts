import { BaseEntity } from 'src/common/base.entity';
import { InvitationEntity } from 'src/modules/invitations/entities/invitation.entity';
import { MatchTeamEntity } from 'src/modules/matches/entity/match-team.entity';
import { UserEntity } from 'src/modules/users/entity/user.entity';
import { Column, Entity, OneToMany, OneToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'equipos' })
export class TeamEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 75, nullable: false })
  nombre: string;

  @OneToMany(() => UserEntity, (user) => user.equipo)
  usuarios: UserEntity[];

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'creador_id' })
  creador: UserEntity;

  @OneToMany(() => InvitationEntity, (inv) => inv.equipo)
  invitaciones: InvitationEntity[];

  @OneToMany(() => MatchTeamEntity, (mt) => mt.equipo)
  partido: MatchTeamEntity;
}
