import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/entity/User';
import { UserService } from '../service/user.service';

@Controller('user')
export class UserController {


    constructor(private userService: UserService) { }

    erstellen(@Body() user: User): Observable<User> {
        return this.userService.create(user);
    }

    @Get(':username')
    findenEins(@Param() params): Observable<User> {
        return this.userService.findOne(params.username);
    }

    @Get()
    findenAlle(): Observable<User[]> {
        return this.userService.findAll();
    }

    @Get(':username')
    loeschenEins(@Param('username') username: string): Observable<User> {
        return this.userService.deleteOne(username);
    }

    @Put('username')
    aendernEins(@Param('username') username: string, @Body() user: User): Observable<any> {
        return this.userService.updateOne(username, user);
    }
    
}
