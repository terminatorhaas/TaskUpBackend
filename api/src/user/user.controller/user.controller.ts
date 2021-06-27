import { Controller, Post, Body, Get, Param, Delete, Put, UseGuards, HttpCode } from '@nestjs/common';
import { UserService } from '../user.service/user.service';
import { User, UserRole } from '../user.models/user.interface';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Interessen } from 'src/interessen/interessen.models/interessen.interface';
import { hasRoles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserCheckGuard } from 'src/auth/guards/UserCheck.guard';
import { Kalender } from 'src/kalender/kalender.models/kalender.interface';


@Controller('users')
export class UserController {

    constructor(private userService: UserService) { }

    @Post()
    create(@Body() user: User): Observable<User | Object> {
        
            console.log("ich bin noch da")
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

    @UseGuards(JwtAuthGuard, UserCheckGuard)
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

    @UseGuards(JwtAuthGuard, UserCheckGuard)
    @Put(':username')
    updateOne(@Param('username') username: string, @Body() user: User): Observable<any> {
        return this.userService.updateOne(username,user);
    }

    @UseGuards(JwtAuthGuard, UserCheckGuard)
    @Put(':username/interesse/:interessenID')
    @HttpCode(204)
    addTieToInteresse(@Param('username') username: string, @Param('interessenID') interessenID?: number): void {
        this.userService.addTieToInteresse(username, interessenID);
    }

    @Get(':username/interessen')
    findeInteressenZuUser(@Param('username') username: string): Observable<Interessen[]> {
            return this.userService.findeInteressenZuUser(username);
    }

    @Delete(':username/interessen/:interessenID')
    @HttpCode(204)
    deleteTieFromInteresse(@Param('username') username: string, @Param('interessenID') interessenID?: number): void {
            this.userService.deleteTieFromInteresse(username, interessenID);
    }

    @Put(':username/Kalender/:kalenderID')
    @HttpCode(204)
    addTieToKalender(@Param('username') username: string, @Param('kalenderID') kalenderID: number): void {
        this.userService.addTieToKalender(username, kalenderID);
    }

    @Get(':username/kalender/')
    findeKalenderZuUser(@Param('username') username: string): Observable<Kalender[]> {
        return this.userService.findeKalenderZuUser(username);
    }

    @Delete(':username/Kalender/:kalenderId')
    @HttpCode(204)
    removeTieFromKalender(@Param('username') username: string, @Param('kalenderId') kalenderId: number): void {
        return this.userService.removeTieFromKalender(username, kalenderId);
    }



    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':username/:role')
    updateRole( @Param('username') username: string, @Param('role') role: string): Observable<any>{   
     
        return this.userService.updateRoleOfUser(username,role);
    }

    

}
