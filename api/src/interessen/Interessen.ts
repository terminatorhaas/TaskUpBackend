import { Column, Entity, Index, JoinTable, ManyToMany } from "typeorm";
import { UserEntity } from "../user/models/user.entity";
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

  @ManyToMany(() => UserEntity, (user) => user.interessens)
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
  users: UserEntity[];

  @ManyToMany(() => Aktivitaeten, (aktivitaeten) => aktivitaeten.interessens)
  aktivitaetens: Aktivitaeten[];
}
