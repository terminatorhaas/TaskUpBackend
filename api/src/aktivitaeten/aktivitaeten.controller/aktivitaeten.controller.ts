import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Aktivitaeten } from '../aktivitaeten.models/aktivitaeten.interface';
import { AktivitaetenService } from '../aktivitaeten.service/aktivitaeten.service';

@Controller('aktivitaeten')
export class AktivitaetenController {

    constructor(private aktivitaetenService: AktivitaetenService) { }

    @Post()
    create(@Body() aktivitaet: Aktivitaeten): Observable<Aktivitaeten> {
        return this.aktivitaetenService.create(aktivitaet);
    }

    @Get(':aktivitaetsBezeichnung')
    findOne(@Param() params): Observable<Aktivitaeten> {
        return this.aktivitaetenService.findOne(params.aktivitaetsBezeichnung);
    }

    @Get()
    findAll(): Observable<Aktivitaeten[]> {
        return this.aktivitaetenService.findAll();
    }

    @Put(':aktivitaetsBezeichnung')
    updateOne(@Param('aktivitaetsBezeichnung') aktivitaetsBezeichnung: string, @Body() aktivitaet: Aktivitaeten): Observable<any> {
        return this.aktivitaetenService.updateOne(aktivitaetsBezeichnung, aktivitaet);
    }

    @Delete(':aktivitaetsBezeichnung')
    deleteOne(@Param('aktivitaetsBezeichnung') aktivitaetsBezeichnung: string): Observable<any> {
        return this.aktivitaetenService.deleteOne(aktivitaetsBezeichnung);
    }

}
