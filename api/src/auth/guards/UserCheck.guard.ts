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
    // this function check if the user, who is provided in the JWT Token is the same as the one that is given by the Request
    // this is a security feature, so no data can by exploited or changed unauthorized. 
    // if this function returns false, the request gets answered with an HTTP Code 401
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