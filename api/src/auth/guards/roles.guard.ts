import { Injectable, CanActivate, ExecutionContext, Inject, forwardRef } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { UserEntity } from "src/user/user.models/user.entity";
import { UserService } from "src/user/user.service/user.service";



@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,

        @Inject(forwardRef(() => UserService))
        private userService: UserService,
    ) { }
    
    // there are sereral RestEndpoint, which are just for specific roles like an admin, so this functions checks if the 
    // role that is decleard in the endpoint, is commmited to the user in the database. 
    // this is a security feature, so no data can by exploited or changed unauthorized. 
    // if this function returns false, the request gets answered with an HTTP Code 401
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user: UserEntity = request.user.user;

        return this.userService.findOne(user.username).pipe(
            map((user: UserEntity) => {
                const hasRole = () => roles.indexOf(user.role) > -1;
                let hasPermission: boolean = false;

                if (hasRole()) {
                    hasPermission = true;
                };
                return user && hasPermission;
            })
        )
    }
} 