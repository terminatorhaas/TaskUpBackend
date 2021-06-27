import { Injectable, CanActivate, Inject, forwardRef, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserService } from "../../user/user.service/user.service";
import { User } from "../../user/user.models/user.interface"
import { map } from "rxjs/operators";


@Injectable()
export class UserCheckGuard implements CanActivate{

    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService
    ) {

    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const params = request.params;
        const user: User = request.user.user; 

        return this.userService.findOne(user.username).pipe(
            map((user: User) => {
                var hasPermission = false;

                if(user.username === params.username) {
                    hasPermission = true;
                }

                return user && hasPermission;                
            })
        )
    }


} 