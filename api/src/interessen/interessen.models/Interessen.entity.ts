import { Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../../user/user.models/user.entity";
import { AktivitaetenEntity } from "../../aktivitaeten/aktivitaeten.models/aktivitaeten.entity";

@Index("interessenBezeichnung", ["interessenBezeichnung"], { unique: true })
@Entity("interessen", { schema: "taskUPdb" })
export class InteressenEntity {
  
  
  @PrimaryGeneratedColumn('increment', {name:"interessenID"})
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

  @ManyToMany(() => AktivitaetenEntity, (aktivitaeten) => aktivitaeten.interessens)
  aktivitaetens: AktivitaetenEntity[];
}
