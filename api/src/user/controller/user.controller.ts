import { Controller, Post, Body, Get, Param, Delete, Put } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../models/user.interface';
import { Observable } from 'rxjs';

@Controller('users')
export class UserController {

    constructor(private userService: UserService) { }

    @Post()
    create(@Body() user: User): Observable<User> {
        return this.userService.create(user);
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

}
