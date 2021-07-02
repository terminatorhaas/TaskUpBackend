import { InteressenAktivitaetenEntity } from "src/interessenAktivitaeten/interessenAktivitaeten.models/interessenAktivitaeten.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EreignisEntity } from "../../ereignis/ereignis.models/ereignis.entity";

@Entity("aktivitaeten", { schema: "taskUPdb" })
export class AktivitaetenEntity {
  @PrimaryGeneratedColumn( "increment", {name: "aktivitaetenID" })
  aktivitaetenID: number;

  @Column("varchar", {
    name: "aktivitaets_bezeichnung",
    unique: true, //vorher "nullable" --> ist unique hier ok?
    length: 150,
  })
  aktivitaetsBezeichnung: string | null;

  @Column("varchar", {
    name: "aktivitaets_satz",
    length: 250,
  })
  aktivitaetsSatz: string | null;

  @OneToMany(() => EreignisEntity, (ereignis) => ereignis.aktivitaetenId)
  ereignis: EreignisEntity[];

  @OneToMany(type => InteressenAktivitaetenEntity, interessenAktivitaeten => interessenAktivitaeten.aktivitaetenID) 
  public interessens: InteressenAktivitaetenEntity[];
}
