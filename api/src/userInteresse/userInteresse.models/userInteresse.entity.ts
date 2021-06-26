import { BeforeInsert, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { InteressenEntity } from "../../interessen/interessen.models/Interessen.entity";
import { UserEntity } from "src/user/user.models/user.entity";

@Entity("user_interessen", { schema: "taskUPdb" })
export class UserInteresseEntity {

  @PrimaryColumn("varchar", {name: "username", length: 30})
  @ManyToOne(type => UserEntity)
  @JoinColumn([{name: "username", referencedColumnName: "username" }])
  username: string;

  @PrimaryColumn("int", {name: "interessenID"})
  @ManyToOne(type => InteressenEntity)
  @JoinColumn([{name: "interessenID", referencedColumnName: "interessenID" }])
  interessenID: number;
}
