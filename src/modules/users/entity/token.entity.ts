import { TypeToken } from 'src/common/enums/type-token.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntity } from 'src/common/base.entity';

@Entity({ name: 'tokens' })
export class TokenEntity extends BaseEntity {
  @Column({ type: 'enum', enum: TypeToken, nullable: true })
  tipo: TypeToken | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  token: string | null;

  @Column({ type: 'timestamp', nullable: true })
  expiracion: Date | null;

  @ManyToOne(() => UserEntity, (user) => user.tokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: UserEntity;
}
