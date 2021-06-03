import { Column, Entity, Index, ManyToMany } from "typeorm";
import { Kalender } from "../../kalender/Kalender";
import { Interessen } from "../../interessen/Interessen";

@Index("email", ["email"], { unique: true })
@Entity("user", { schema: "taskUPdb" })
export class UserEntity {
  @Column("varchar", { primary: true, name: "username", length: 30 })
  username: string;

  @Column("varchar", { name: "email", unique: true, length: 30 })
  email: string;

  @Column("varchar", { name: "passwort", length: 20 })
  passwort: string;

  @Column("varchar", { name: "vorname", length: 30 })
  vorname: string;

  @Column("varchar", { name: "nachname", length: 50 })
  nachname: string;

  @Column("varchar", { name: "zeitzone", length: 5 })
  zeitzone: string;

  @Column("tinyint", { name: "admin_flag", width: 1 })
  adminFlag: boolean;

  @ManyToMany(() => Kalender, (kalender) => kalender.users)
  kalenders: Kalender[];

  @ManyToMany(() => Interessen, (interessen) => interessen.users)
  interessens: Interessen[];
}
