import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "../../user/user.models/user.entity";
import { EreignisEntity } from "../../ereignis/ereignis.models/ereignis.entity";

@Entity("kalender", { schema: "taskUPdb" })
export class KalenderEntity {
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

  @OneToMany(() => EreignisEntity, (ereignis) => ereignis.kalender)
  ereignis: EreignisEntity[];
}
