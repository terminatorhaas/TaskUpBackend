import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AktivitaetenEntity } from "../../aktivitaeten/aktivitaeten.models/aktivitaeten.entity";
import {  KalenderEntity } from "../../kalender/kalender.models/kalender.entity";

@Index("ereignisVerweistAufExistierendenKalender", ["kalenderId"], {})
@Index("ereignisVerweistAufExistierendeAktivitaetsID", ["aktivitaetenId"], {})
@Entity("ereignis", { schema: "taskUPdb" })
export class EreignisEntity {
  @Column("int", { name: "aktivitaetenID" })
  aktivitaetenId: number;

  @PrimaryGeneratedColumn({ type: "int", name: "ereignisID" })
  ereignisId: number;

  @Column("int", { primary: true, name: "kalenderID" })
  kalenderId: number;

  @Column("varchar", { name: "bezeichnung", nullable: true, length: 150 })
  bezeichnung: string | null;

  @Column("datetime", { name: "beginn_datum_uhr" })
  beginnDatumUhr: Date;

  @Column("datetime", { name: "ende_datum_uhr" })
  endeDatumUhr: Date;

  @ManyToOne(() => AktivitaetenEntity, (aktivitaeten) => aktivitaeten.ereignis, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([
    { name: "aktivitaetenID", referencedColumnName: "aktivitaetenId" },
  ])
  aktivitaeten: AktivitaetenEntity;

  @ManyToOne(() => KalenderEntity, (kalender) => kalender.ereignis, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "kalenderID", referencedColumnName: "kalenderID" }])
  kalender: KalenderEntity;
}
