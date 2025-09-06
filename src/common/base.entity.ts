import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp', name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'actualizado_en' })
  actualizadoEn: Date;
}
