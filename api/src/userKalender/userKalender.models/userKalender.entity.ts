import { BeforeInsert, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { UserEntity } from "src/user/user.models/user.entity";
import { KalenderEntity } from "src/kalender/kalender.models/kalender.entity";

@Entity("user_kalender", { schema: "taskUPdb" })
export class UserKalenderEntity {

  @PrimaryColumn("varchar", {name: "username", length: 30})
  @ManyToOne(type => UserEntity)
  @JoinColumn([{name: "username", referencedColumnName: "username" }])
  username: string;

  @PrimaryColumn("int", {name: "kalenderID"})
  @ManyToOne(type => KalenderEntity)
  @JoinColumn([{name: "kalenderID", referencedColumnName: "kalenderID" }])
  kalenderID: number;
}
