import { InteressenEntity } from "src/interessen/interessen.models/Interessen.entity";
import { UserEntity } from "src/user/user.models/user.entity";

export interface UserInteresse {
username: UserEntity;
interessenID: InteressenEntity;
}
