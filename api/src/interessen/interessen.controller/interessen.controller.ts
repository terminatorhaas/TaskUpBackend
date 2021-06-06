import { Body, Controller, Get, Post } from '@nestjs/common';
import { Interessen } from '../interessen.models/interessen.interface';
import { InteressenService } from '../interessen.service/interessen.service';
import { Observable, of ,from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Controller('interessen')
export class InteressenController {

    constructor(private interessenService: InteressenService) { }

    @Get()
    findAll(): Observable<Interessen[]> {
        return this.interessenService.findAll();
    }

    @Post()
    create(@Body() Interessen: Interessen): Observable<Interessen> {
        return this.interessenService.create(Interessen);
    }

    
}
