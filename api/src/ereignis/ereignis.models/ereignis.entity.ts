import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AktivitaetenEntity } from "../../aktivitaeten/aktivitaeten.models/aktivitaeten.entity";
import {  KalenderEntity } from "../../kalender/kalender.models/kalender.entity";

@Index("ereignisVerweistAufExistierendenKalender", ["kalenderId"], {})
@Index("ereignisVerweistAufExistierendeAktivitaetsID", ["aktivitaetenId"], {})
@Entity("ereignis", { schema: "taskUPdb" })
export class EreignisEntity {
  @Column("int", { name: "aktivitaetenID" })
  @ManyToOne(() => AktivitaetenEntity, (aktivitaeten) => aktivitaeten.ereignis, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([
    { name: "aktivitaetenID", referencedColumnName: "aktivitaetenID" },
  ])
  aktivitaetenId: number;

  @PrimaryGeneratedColumn({ type: "int", name: "ereignisID" })
  ereignisId: number;

  @PrimaryColumn({ type: "int", name: "kalenderID" })
  @ManyToOne(() => KalenderEntity, (kalender) => kalender.ereignis, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "kalenderID", referencedColumnName: "kalenderID" }])
  kalenderId: number;

  @Column("varchar", { name: "bezeichnung", nullable: true, length: 150 })
  bezeichnung: string | null;

  @Column("datetime", { name: "beginn_datum_uhr" })
  beginnDatumUhr: Date;

  @Column("datetime", { name: "ende_datum_uhr" })
  endeDatumUhr: Date;
}
