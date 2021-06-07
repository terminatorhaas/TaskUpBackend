import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Interessen } from '../interessen.models/interessen.interface';
import { InteressenService } from '../interessen.service/interessen.service';
import { Observable, of ,from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Controller('interessen')
export class InteressenController {

    constructor(private interessenService: InteressenService) { }

    @Get(':interessenBezeichnung')
    findOne(@Param() params): Observable<Interessen> {
        return this.interessenService.findOne(params.interessenBezeichnung);
    }

    @Get()
    findAll(): Observable<Interessen[]> {
        return this.interessenService.findAll();
    }

    @Post()
    create(@Body() Interessen: Interessen): Observable<Interessen> {
        return this.interessenService.create(Interessen);
    }

    @Put(':interessenBezeichnung')
    updateOne(@Param('interessenBezeichnung') interessenBezeichnung: string, @Body() interesse: Interessen): Observable<any> {
        return this.interessenService.updateOne(interessenBezeichnung, interesse);
    }

    @Delete(':interessenBezeichnung')
    deleteOne(@Param('interessenBezeichnung') interessenBezeichnung: string): Observable<any> {
        return this.interessenService.deleteOne(interessenBezeichnung);
    }

    
}
