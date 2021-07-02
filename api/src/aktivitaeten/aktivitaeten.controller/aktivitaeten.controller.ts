import { Body, Controller, Delete, forwardRef, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { InteressenEntity } from 'src/interessen/interessen.models/Interessen.entity';
import { User , UserRole } from 'src/user/user.models/user.interface';

import { hasRoles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

import { Interessen } from 'src/interessen/interessen.models/interessen.interface';
import { Aktivitaeten } from '../aktivitaeten.models/aktivitaeten.interface';
import { AktivitaetenService } from '../aktivitaeten.service/aktivitaeten.service';

@Controller('aktivitaeten')
export class AktivitaetenController {

    constructor(private aktivitaetenService: AktivitaetenService){}
    

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    create(@Body() aktivitaet: Aktivitaeten): Observable<Aktivitaeten> {
        return this.aktivitaetenService.create(aktivitaet);
    }

    @Get(':aktivitaetenID')
    findOne(@Param('aktivitaetenID') aktivitaetenID: number): Observable<Aktivitaeten> {
        return this.aktivitaetenService.findOne(aktivitaetenID);

    }

    @Get()
    findAll(): Observable<Aktivitaeten[]> {
        return this.aktivitaetenService.findAll();
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':activityID')
    updateOne(@Param('activityID') activityID: number, @Body() activity: Aktivitaeten): Observable<any> {
        return this.aktivitaetenService.updateOne(activityID, activity);
    }
    
    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)  
    @Delete(':activityID')
    deleteOne(@Param('activityID') activityID: number): Observable<any> {
        return this.aktivitaetenService.deleteOne(activityID);

    }

    @Get(':activityID/interessen/')
    findInteressenToAktivitaet(@Param('activityID') activityID: number): Observable<Interessen[]> {
        return this.aktivitaetenService.findInteressenToAktivitaet(activityID);
    }


    @Get('aa/:interestID')
    findAktivitaetenToInteresse(@Param('interestID') interestID : number): Observable<Aktivitaeten[]>{
        return this.aktivitaetenService.findAktivitaetenToInteresse(interestID);
    }

}
