import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { hasRoles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/user/user.models/user.interface';
import { Aktivitaeten } from '../aktivitaeten.models/aktivitaeten.interface';
import { AktivitaetenService } from '../aktivitaeten.service/aktivitaeten.service';

@Controller('aktivitaeten')
export class AktivitaetenController {

    constructor(private aktivitaetenService: AktivitaetenService) { }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
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

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':aktivitaetsBezeichnung')
    updateOne(@Param('aktivitaetsBezeichnung') aktivitaetsBezeichnung: string, @Body() aktivitaet: Aktivitaeten): Observable<any> {
        return this.aktivitaetenService.updateOne(aktivitaetsBezeichnung, aktivitaet);
    }
    
    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':aktivitaetsBezeichnung')
    deleteOne(@Param('aktivitaetsBezeichnung') aktivitaetsBezeichnung: string): Observable<any> {
        return this.aktivitaetenService.deleteOne(aktivitaetsBezeichnung);
    }

}
