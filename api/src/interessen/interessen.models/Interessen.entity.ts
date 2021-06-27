import { BaseEntity, Column, Entity, Index, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { UserEntity } from "../../user/user.models/user.entity";
import { AktivitaetenEntity } from "../../aktivitaeten/aktivitaeten.models/aktivitaeten.entity";
import { UserInteresseEntity } from "src/userInteresse/userInteresse.models/userInteresse.entity";
import { InteressenAktivitaetenEntity } from "src/interessenAktivitaeten/interessenAktivitaeten.models/interessenAktivitaeten.entity";

@Index("interessenBezeichnung", ["interessenBezeichnung"], { unique: true })
@Entity("interessen", { schema: "taskUPdb" })
export class InteressenEntity {
  
  @PrimaryGeneratedColumn('increment', {name:"interessenID"})
  interessenID: number;
  

  @Column("varchar", {
    name: "interessenBezeichnung",
    unique: true,
    length: 30,
  })
  interessenBezeichnung: string;

  @OneToMany(type => UserInteresseEntity, userInteressen => userInteressen.interessenID) 
  public userInteressens: UserInteresseEntity[];

  @OneToMany(type => InteressenAktivitaetenEntity, interessenAktivitaeten => interessenAktivitaeten.interessenID) 
  public aktivitaetens: InteressenAktivitaetenEntity[];
  
}
