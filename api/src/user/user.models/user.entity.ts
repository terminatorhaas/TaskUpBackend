import { BeforeInsert, Column, Entity, Index, ManyToMany, OneToMany } from "typeorm";
import { KalenderEntity } from "../../kalender/kalender.models/kalender.entity";
import { UserRole } from "./user.interface";
import { UserInteresseEntity } from "src/userInteresse/userInteresse.models/userInteresse.entity";

@Index("email", ["email"], { unique: true })
@Entity("user", { schema: "taskUPdb" })
export class UserEntity {
  @Column("varchar", { primary: true, name: "username", length: 30 })
  username: string;

  @Column("varchar", { name: "email", unique: true, length: 30 })
  email: string;

  @Column("varchar", { name: "passwort", length: 60})
  passwort: string;

  @Column("varchar", { name: "vorname", length: 30 })
  vorname: string;

  @Column("varchar", { name: "nachname", length: 50 })
  nachname: string;

  @Column("varchar", { name: "zeitzone", length: 5 })
  zeitzone: string;

  @Column("tinyint", { name: "admin_flag", width: 1 })
  adminFlag: boolean;

  @Column({type: 'enum', enum: UserRole, default: UserRole.USER})
    role: UserRole;

  @BeforeInsert()
  emailInKleinschreibung() {
    this.email = this.email.toLowerCase();
  }

  @ManyToMany(type => KalenderEntity, kalender => kalender.users)
  public kalenders: KalenderEntity[];

  @OneToMany(type => UserInteresseEntity, userInteressen => userInteressen.username)
  public interessens: UserInteresseEntity[];
}
