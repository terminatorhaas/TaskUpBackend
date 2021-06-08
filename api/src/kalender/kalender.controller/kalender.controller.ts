import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Kalender } from '../kalender.models/kalender.interface';
import { KalenderService } from '../kalender.service/kalender.service';


@Controller('kalender')
export class KalenderController {

    constructor(private kalenderService: KalenderService) { }

    @Post()
    create(@Body() kalender: Kalender): Observable<Kalender> {
        return this.kalenderService.create(kalender);
    }

    @Get('kalenderId')
    findOne(@Param() params): Observable<Kalender> {
        return this.kalenderService.findOne(params.kalenderId);
    }

    @Get()
    findAll(): Observable<Kalender[]> {
        return this.kalenderService.findAll();
    }

    @Put(':kalenderId')
    updateOne(@Param('kalenderId') kalenderId: number, @Body() kalender: Kalender): Observable<any> {
        return this.kalenderService.updateOne(kalenderId, kalender);
    }

    @Delete(':kalenderId')
    deleteOne(@Param('kalenderId') kalenderId: number): Observable<any> {
        return this.kalenderService.deleteOne(kalenderId);
    }









}
