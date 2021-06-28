import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { userInfo } from 'os';
import { Observable } from 'rxjs';
import { InteressenEntity } from 'src/interessen/interessen.models/Interessen.entity';
import { User } from 'src/user/user.models/user.interface';

import { hasRoles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

import { Interessen } from 'src/interessen/interessen.models/interessen.interface';
import { Aktivitaeten } from '../aktivitaeten.models/aktivitaeten.interface';
import { AktivitaetenService } from '../aktivitaeten.service/aktivitaeten.service';

@Controller('aktivitaeten')
export class AktivitaetenController {

    constructor(private aktivitaetenService: AktivitaetenService) { }
/*
    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
*/    
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
/*
    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
*/
    @Put(':aktivitaetenID')
    updateOne(@Param('aktivitaetenID') aktivitaetenID: number, @Body() aktivitaet: Aktivitaeten): Observable<any> {
        return this.aktivitaetenService.updateOne(aktivitaetenID, aktivitaet);
    }
/*    
    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
*/  
    @Delete(':aktivitaetenID')
    deleteOne(@Param('aktivitaetenID') aktivitaetenID: number): Observable<any> {
        return this.aktivitaetenService.deleteOne(aktivitaetenID);

    }

    @Get(':aktivitaetenId/interessen/')
    findeInteressenZuAktivitaet(@Param('aktivitaetenId') aktivitaetenId: number): Observable<Interessen[]> {
        return this.aktivitaetenService.findeInteressenZuAktivitaet(aktivitaetenId);
    }

    @Get('vorschlaege/:username')
    generateVorschlaege(@Body() user: User):Observable<InteressenEntity[]>{
        return ;
    }
}
