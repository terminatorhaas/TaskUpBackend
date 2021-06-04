import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable, of } from 'rxjs';
import { User } from 'src/user/models/user.interface';
const bcrypt = require('bcrypt');


@Injectable()
export class AuthService {


    constructor(private readonly jwtService: JwtService){}
    
    generiereJWT(user: User): Observable <string> {
        return from(this.jwtService.signAsync({user}));


    }

    hashPasswort(passwort: string): Observable <string> {
        return from<string>(bcrypt.hash(passwort, 12));


    }

    vergleichePasswort(neuesPasswort: string, passwortHash: string): Observable <any | boolean> {
        return from<any | boolean>(bcrypt.compare(neuesPasswort, passwortHash));

    }

    

}
