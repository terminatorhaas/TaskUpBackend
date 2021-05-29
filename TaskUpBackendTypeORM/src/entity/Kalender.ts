import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Ereignis } from "./Ereignis";

@Entity("kalender", { schema: "taskUPdb" })
export class Kalender {
  @PrimaryGeneratedColumn({ type: "int", name: "kalenderID" })
  kalenderId: number;

  @Column("varchar", { name: "bezeichnung", nullable: true, length: 150 })
  bezeichnung: string | null;

  @ManyToMany(() => User, (user) => user.kalenders)
  @JoinTable({
    name: "user_kalender",
    joinColumns: [{ name: "kalenderID", referencedColumnName: "kalenderId" }],
    inverseJoinColumns: [
      { name: "username", referencedColumnName: "username" },
    ],
    schema: "taskUPdb",
  })
  users: User[];

  @OneToMany(() => Ereignis, (ereignis) => ereignis.kalender)
  ereignis: Ereignis[];
}
