import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EreignisEntity } from "../../ereignis/ereignis.models/ereignis.entity";
import { UserKalenderEntity } from "src/userKalender/userKalender.models/userKalender.entity";

@Entity("kalender", { schema: "taskUPdb" })
export class KalenderEntity {
  @PrimaryGeneratedColumn('increment', { name:"kalenderID" })
  kalenderID: number;

  @Column("varchar", { name: "bezeichnung", nullable: true, length: 150 })
  bezeichnung: string | null;

  @OneToMany(type => UserKalenderEntity, userKalender => userKalender.kalenderID)
  userKalenders: UserKalenderEntity[];

  @OneToMany(() => EreignisEntity, (ereignis) => ereignis.kalender)
  ereignis: EreignisEntity[];
}
