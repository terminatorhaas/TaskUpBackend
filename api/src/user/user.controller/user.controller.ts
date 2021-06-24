import { Controller, Post, Body, Get, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { UserService } from '../user.service/user.service';
import { User, UserRole } from '../user.models/user.interface';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Interessen } from 'src/interessen/interessen.models/interessen.interface';
import { hasRoles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('users')
export class UserController {

    constructor(private userService: UserService) { }

    @Post()
    create(@Body() user: User): Observable<User | Object> {
        return this.userService.create(user).pipe(
            map((user: User) => user),
            catchError(err => of({error: err.message}))
        );
    }

    @Post('login')
    login(@Body() user: User): Observable<Object> {
        return this.userService.login(user).pipe(
            map((jwt: string) => {
                return {access_token: jwt};
            }
            )
        )
    }

    @Get(':username')
    findOne(@Param() params): Observable<User> {
        return this.userService.findOne(params.username);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    findAll(user: User): Observable<any> | Promise<any> | Boolean {
        return this.userService.findAll();
    }

    @Delete(':username')
    deleteOne(@Param('username')username: string): Observable<any> {
        return this.userService.deleteOne(username);
    }

    @Put(':username')
    updateOne(@Param('username') username: string, @Body() user: User): Observable<any> {
        return this.userService.updateOne(username,user);
    }

    @Put(':username/bindInteresse')
    addTieToInteresse(@Param('username') username: string, @Body('interessenBezeichnung') interessenBezeichnung?: string): Observable<any> {
        return this.userService.addTieToInteresse(username, interessenBezeichnung);
    }

    @Get(':username/bindInteresse')
    findeInteressenZuUser(@Param('username') username: string): Observable<Interessen[]> {
            return this.userService.findeInteressenZuUser(username);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put('username/role')
    updateRole(@Body ('username') username: string, @Body('role') role: string): Observable<any>{   
     
        return this.userService.updateRoleOfUser(username,role);
    }

    

}
