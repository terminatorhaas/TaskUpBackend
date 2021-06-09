import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EreignisEntity } from "../../ereignis/ereignis.models/ereignis.entity";
import { InteressenEntity } from "../../interessen/interessen.models/Interessen.entity";

@Entity("aktivitaeten", { schema: "taskUPdb" })
export class AktivitaetenEntity {
  @PrimaryGeneratedColumn( "increment", {name: "aktivitaetenID" })
  aktivitaetenId: number;

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

  @OneToMany(() => EreignisEntity, (ereignis) => ereignis.aktivitaeten)
  ereignis: EreignisEntity[];

  @ManyToMany(() => InteressenEntity, (interessen) => interessen.aktivitaetens)
  @JoinTable({
    name: "aktivitaeten_interesse_kategorien",
    joinColumns: [
      { name: "aktivitaetenID", referencedColumnName: "aktivitaetenId" },
    ],
    inverseJoinColumns: [
      { name: "interessenID", referencedColumnName: "interessenId" },
    ],
    schema: "taskUPdb",
  })
  interessens: InteressenEntity[];
}
