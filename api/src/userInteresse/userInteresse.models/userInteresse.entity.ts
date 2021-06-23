import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { InteressenEntity } from "../../interessen/interessen.models/Interessen.entity";
import { UserEntity } from "src/user/user.models/user.entity";

@Entity("user_interessen", { schema: "taskUPdb" })
export class UserInteresseEntity {

  @PrimaryColumn("int")
  @ManyToOne(type => UserEntity, user => user.username)
  username: UserEntity;

  @PrimaryColumn("varchar")
  @ManyToOne(type => InteressenEntity, interessen => interessen.interessenId)
  interessenID: InteressenEntity;
}
