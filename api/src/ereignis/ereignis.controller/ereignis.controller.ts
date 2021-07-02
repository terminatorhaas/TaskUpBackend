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
    create(@Body() event: EreignisEntity): Observable<EreignisEntity | Object> {
        return this.ereignisService.create(event).pipe(
            map((event: Ereignis) => event),
            catchError(err => of({error: err.message}))
        );
    }

    @Get('kalender/:calendarID')
    findEreignisseToKalender(@Param('calendarID') calendarID: number): Observable<Ereignis[]> {
        return from(this.ereignisService.findEreignisseToKalender(calendarID));
    }

    @Get(':eventID/:calendarID')
    findOne(@Param('eventID') eventID: number, @Param('calendarID') calendarID: number): Observable<Ereignis> {
        return from(this.ereignisService.findOne(eventID, calendarID));
    }

    @Put(':eventID/:calendarID')
    updateOne(@Param('eventID') eventID: number,  @Param('calendarID') calendarID: number, @Body() event: Ereignis): Observable<any> {
        return this.ereignisService.updateOne(eventID, calendarID, event);
    }

    @Delete(':eventID/:calendarID')
    @HttpCode(204)
    deleteOne(@Param('eventID') eventID: number, @Param('calendarID') calendarID: number): Observable<any> {
        return this.ereignisService.deleteOne(eventID, calendarID);
    }


}
