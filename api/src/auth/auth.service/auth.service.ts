import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable, of } from 'rxjs';
import { User } from 'src/user/user.models/user.interface';
const bcrypt = require('bcrypt');


@Injectable()
export class AuthService {


    constructor(private readonly jwtService: JwtService){}
    
    generateJWT(user: User): Observable <string> {          //generation of JWT token (if login is successful)
        return from(this.jwtService.signAsync({user}));
    }

    hashPassword(password: string): Observable <string> {   //hashes pw, used at registration and comparison of entered pw 
        return from<string>(bcrypt.hash(password, 12));
    }

    comparePassword(newPassword: string, passwordHash: string): Observable <any | boolean> {    //compares saved pw hash with entered pw hash
        return from<any | boolean>(bcrypt.compare(newPassword, passwordHash));

    }

    

}
