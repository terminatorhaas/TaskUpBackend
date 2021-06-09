import { Controller, Post, Body, Get, Param, Delete, Put } from '@nestjs/common';
import { UserService } from '../user.service/user.service';
import { User } from '../user.models/user.interface';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Interessen } from 'src/interessen/interessen.models/interessen.interface';

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

    @Get()
    findAll(): Observable<User[]> {
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
    tieToInteresse(@Param('username') username: string, @Body('interessenBezeichnung') interessenBezeichnung?: string): Observable<any> {
        return this.userService.tieToInteresse(username, interessenBezeichnung);
    }

    @Get(':username/bindInteresse')
    findeInteressenZuUser(@Param('username') username: string): Observable<Interessen[]> {
            return this.userService.findeInteressenZuUser(username);
    }

}
