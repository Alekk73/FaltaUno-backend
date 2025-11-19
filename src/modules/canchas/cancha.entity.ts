import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

//se llama "canchas"en español porque me sonaba raro field
@Entity("canchas")
export class Cancha {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100, unique: true })
  nombre: string;


}
