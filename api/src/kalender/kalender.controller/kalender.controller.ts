import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { hasRoles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/user/user.models/user.interface';
import { Kalender } from '../kalender.models/kalender.interface';
import { KalenderService } from '../kalender.service/kalender.service';


@Controller('kalender')
export class KalenderController {

    constructor(private kalenderService: KalenderService) { }
    
    @Post()
    create(@Body() kalender: Kalender): Observable<Kalender> {
        return this.kalenderService.create(kalender);
    }

    @Get(':calendarID')
    findOne(@Param() params): Observable<Kalender> {
        return this.kalenderService.findOne(params.calendarID);
    }

    @Get()
    findAll(): Observable<Kalender[]> {
        return this.kalenderService.findAll();
    }
    
    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)  
    @Put(':calendarID')
    updateOne(@Param('calendarID') calendarID: number, @Body() calendar: Kalender): Observable<any> {
        return this.kalenderService.updateOne(calendarID, calendar);
    }

    @Delete(':calendarID')
    deleteOne(@Param('calendarID') calendarID: number): Observable<any> {
        return this.kalenderService.deleteOne(calendarID);
    }

}
