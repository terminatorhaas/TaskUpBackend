import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Interessen } from '../interessen.models/interessen.interface';
import { InteressenService } from '../interessen.service/interessen.service';
import { Observable} from 'rxjs';
import { hasRoles } from 'src/auth/decorators/role.decorator';
import { UserRole } from 'src/user/user.models/user.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Aktivitaeten } from 'src/aktivitaeten/aktivitaeten.models/aktivitaeten.interface';

@Controller('interessen')
export class InteressenController {

    constructor(private interessenService: InteressenService) { }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    create(@Body() interest: Interessen): Observable<Interessen> {
        return this.interessenService.create(interest);
    }

    @Get(':interestID')
    findOne(@Param() params): Observable<Interessen> {
        return this.interessenService.findOne(params.interestID);
    }

    @Get()
    findAll(): Observable<Interessen[]> {
        return this.interessenService.findAll();
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':interestID')
    updateOne(@Param('interestID') interestID: number, @Body() interest: Interessen): Observable<any> {
        return this.interessenService.updateOne(interestID, interest);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':interestID')
    deleteOne(@Param('interestID') interestID: number): Observable<any> {
        return this.interessenService.deleteOne(interestID);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':interestID/aktivitaeten/:activityID')
    @HttpCode(204)
    addTieToAktivitaet(@Param('interestID') interestID: number, @Param('activityID') activityID: number): void {
        this.interessenService.addTieToAktivitaet(interestID, activityID);
    }


    @Get(':interestID/aktivitaeten/')
    findeInteressenZuAktivitaet(@Param('interestID') interestID: number): Observable<Aktivitaeten[]> {
        return this.interessenService.findAktivitaetenToInteresse(interestID);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':interestID/aktivitaeten/:activityID')
    @HttpCode(204)
    removeInteressenAktivitaetenTie(@Param('interestID') interestID: number, @Param('activityID') activityID: number) {
        return this.interessenService.removeInteressenAktivitaetenTie(interestID, activityID);
    }





    
}
