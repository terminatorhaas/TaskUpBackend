import { BeforeInsert, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { AktivitaetenEntity } from "src/aktivitaeten/aktivitaeten.models/aktivitaeten.entity";
import { InteressenEntity } from "src/interessen/interessen.models/Interessen.entity";

@Entity("aktivitaeten_interesse_kategorien", { schema: "taskUPdb" })
export class InteressenAktivitaetenEntity {

  @PrimaryColumn("int", {name: "aktivitaetenID"})
  @ManyToOne(type => AktivitaetenEntity)
  @JoinColumn([{name: "aktivitaetenID", referencedColumnName: "aktivitaetenID" }])
  aktivitaetenID: number;

  @PrimaryColumn("int", {name: "interessenID"})
  @ManyToOne(type => InteressenEntity)
  @JoinColumn([{name: "interessenID", referencedColumnName: "interessenID" }])
  interessenID: number;
}
