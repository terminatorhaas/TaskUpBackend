import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EreignisEntity } from '../ereignis.models/ereignis.entity';
import { Ereignis } from '../ereignis.models/ereignis.interface';
import { EreignisService } from '../ereignis.service/ereignis.service';

@Controller('ereignis')
export class EreignisController {


    constructor(private ereignisService: EreignisService) { }

    @Post()
    create(@Body() ereignis: EreignisEntity): Observable<EreignisEntity | Object> {
        return this.ereignisService.create(ereignis).pipe(
            map((ereignis: Ereignis) => ereignis),
            catchError(err => of({error: err.message}))
        );
    }

    @Get(':ereignisID/:kalenderID')
    findOne(@Param('ereignisID') ereignisID: number, @Param('kalenderID') kalenderID: number): Observable<Ereignis> {
        return from(this.ereignisService.findOne(ereignisID, kalenderID));
    }

    @Put(':ereignisID/:kalenderID')
    updateOne(@Param('ereignisID') ereignisID: number,  @Param('kalenderID') kalenderID: number, @Body() ereignis: Ereignis): Observable<any> {
        return this.ereignisService.updateOne(ereignisID, kalenderID, ereignis);
    }

    @Delete(':ereignisID/:kalenderID')
    @HttpCode(204)
    deleteOne(@Param('ereignisID') ereignisID: number, @Param('kalenderID') kalenderID: number): Observable<any> {
        return this.ereignisService.deleteOne(ereignisID, kalenderID);
    }

    @Get('kalender/:kalenderID')
    findEreignisseZuKalender(@Param('kalenderID') kalenderID: number): Observable<Ereignis[]> {
        return from(this.ereignisService.findEreignisseZuKalender(kalenderID));
    }


}
