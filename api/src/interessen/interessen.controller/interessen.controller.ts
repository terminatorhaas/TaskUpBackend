import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Interessen } from '../interessen.models/interessen.interface';
import { InteressenService } from '../interessen.service/interessen.service';
import { Observable, of ,from, throwError } from 'rxjs';
import { hasRoles } from 'src/auth/decorators/role.decorator';
import { UserRole } from 'src/user/user.models/user.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Aktivitaeten } from 'src/aktivitaeten/aktivitaeten.models/aktivitaeten.interface';

@Controller('interessen')
export class InteressenController {

    constructor(private interessenService: InteressenService) { }
/*
    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
*/    
    @Post()
    create(@Body() interessen: Interessen): Observable<Interessen> {
        return this.interessenService.create(interessen);
    }

    @Get(':interessenID')
    findOne(@Param() params): Observable<Interessen> {
        return this.interessenService.findOne(params.interessenID);
    }

    @Get()
    findAll(): Observable<Interessen[]> {
        return this.interessenService.findAll();
    }
/*
    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
*/
    @Put(':interessenID')
    updateOne(@Param('interessenID') interessenID: number, @Body() interesse: Interessen): Observable<any> {
        return this.interessenService.updateOne(interessenID, interesse);
    }
/*
    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
*/
    @Delete(':interessenID')
    deleteOne(@Param('interessenID') interessenID: number): Observable<any> {
        return this.interessenService.deleteOne(interessenID);
    }


    @Put(':interessenId/aktivitaeten/:aktivitaetenId')
    @HttpCode(204)
    addTieToAktivitaet(@Param('interessenId') interessenId: number, @Param('aktivitaetenId') aktivitaetenId: number): void {
        this.interessenService.addTieToAktivitaet(interessenId, aktivitaetenId);
    }


    @Get(':interessenID/aktivitaeten/')
    findeInteressenZuAktivitaet(@Param('interessenID') interessenID: number): Observable<Aktivitaeten[]> {
        return this.interessenService.findeAktivitaetZuInteresse(interessenID);
    }

    @Delete(':interessenID/aktivitaeten/:aktivitaetenID')
    @HttpCode(204)
    removeInteressenAktivitaetenTie(@Param('interessenID') interessenID: number, @Param('aktivitaetenID') aktivitaetenID: number) {
        return this.interessenService.removeInteressenAktivitaetenTie(interessenID, aktivitaetenID);
    }





    
}
