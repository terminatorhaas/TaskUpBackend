import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "../user/models/user.entity";
import { Ereignis } from "../ereignis/Ereignis";

@Entity("kalender", { schema: "taskUPdb" })
export class Kalender {
  @PrimaryGeneratedColumn({ type: "int", name: "kalenderID" })
  kalenderId: number;

  @Column("varchar", { name: "bezeichnung", nullable: true, length: 150 })
  bezeichnung: string | null;

  @ManyToMany(() => UserEntity, (user) => user.kalenders)
  @JoinTable({
    name: "user_kalender",
    joinColumns: [{ name: "kalenderID", referencedColumnName: "kalenderId" }],
    inverseJoinColumns: [
      { name: "username", referencedColumnName: "username" },
    ],
    schema: "taskUPdb",
  })
  users: UserEntity[];

  @OneToMany(() => Ereignis, (ereignis) => ereignis.kalender)
  ereignis: Ereignis[];
}
