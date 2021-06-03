import { Column, Entity, Index, JoinTable, ManyToMany } from "typeorm";
import { User } from "../entity/User";
import { Aktivitaeten } from "../aktivitaeten/Aktivitaeten";

@Index("interessenBezeichnung", ["interessenBezeichnung"], { unique: true })
@Entity("interessen", { schema: "taskUPdb" })
export class Interessen {
  @Column("int", { primary: true, name: "interessenID" })
  interessenId: number;

  @Column("varchar", {
    name: "interessenBezeichnung",
    unique: true,
    length: 30,
  })
  interessenBezeichnung: string;

  @ManyToMany(() => User, (user) => user.interessens)
  @JoinTable({
    name: "user_interessen",
    joinColumns: [
      { name: "interessenID", referencedColumnName: "interessenId" },
    ],
    inverseJoinColumns: [
      { name: "username", referencedColumnName: "username" },
    ],
    schema: "taskUPdb",
  })
  users: User[];

  @ManyToMany(() => Aktivitaeten, (aktivitaeten) => aktivitaeten.interessens)
  aktivitaetens: Aktivitaeten[];
}
