import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Ereignis } from "./Ereignis";
import { Interessen } from "./Interessen";

@Entity("aktivitaeten", { schema: "taskUPdb" })
export class Aktivitaeten {
  @PrimaryGeneratedColumn({ type: "int", name: "aktivitaetenID" })
  aktivitaetenId: number;

  @Column("varchar", {
    name: "aktivitaets_bezeichnung",
    nullable: true,
    length: 150,
  })
  aktivitaetsBezeichnung: string | null;

  @OneToMany(() => Ereignis, (ereignis) => ereignis.aktivitaeten)
  ereignis: Ereignis[];

  @ManyToMany(() => Interessen, (interessen) => interessen.aktivitaetens)
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
  interessens: Interessen[];
}
