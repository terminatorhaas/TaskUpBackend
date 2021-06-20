import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Interessen } from '../interessen.models/interessen.interface';
import { InteressenService } from '../interessen.service/interessen.service';
import { Observable, of ,from, throwError } from 'rxjs';
import { hasRoles } from 'src/auth/decorators/role.decorator';
import { UserRole } from 'src/user/user.models/user.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

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

    @Get(':interessenBezeichnung')
    findOne(@Param() params): Observable<Interessen> {
        return this.interessenService.findOne(params.interessenBezeichnung);
    }

    @Get()
    findAll(): Observable<Interessen[]> {
        return this.interessenService.findAll();
    }
/*
    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
*/
    @Put(':interessenBezeichnung')
    updateOne(@Param('interessenBezeichnung') interessenBezeichnung: string, @Body() interesse: Interessen): Observable<any> {
        return this.interessenService.updateOne(interessenBezeichnung, interesse);
    }
/*
    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
*/
    @Delete(':interessenBezeichnung')
    deleteOne(@Param('interessenBezeichnung') interessenBezeichnung: string): Observable<any> {
        return this.interessenService.deleteOne(interessenBezeichnung);
    }

    
}
