import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user.models/user.entity';
import { User } from '../user.models/user.interface';
import { Interessen } from '../../interessen/interessen.models/interessen.interface';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service/auth.service';
import { InteressenService } from 'src/interessen/interessen.service/interessen.service';
import { UserRole } from "../user.models/user.interface";
import { UserInteresseService } from 'src/userInteresse/userInteresse.service/user-interesse.service';
import { UserKalenderService } from 'src/userKalender/userKalender.service/user-kalender.service';
import { Kalender } from 'src/kalender/kalender.models/kalender.interface';
import { KalenderService } from 'src/kalender/kalender.service/kalender.service';
import { getConnection, Repository } from 'typeorm';
import { AktivitaetenService } from 'src/aktivitaeten/aktivitaeten.service/aktivitaeten.service';
import { Aktivitaeten } from 'src/aktivitaeten/aktivitaeten.models/aktivitaeten.interface';



@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @Inject(forwardRef(() => InteressenService))
        private readonly interessenService: InteressenService,

        @Inject(forwardRef(() => KalenderService))
        private readonly kalenderService: KalenderService,

        @Inject(forwardRef(() => AktivitaetenService))
        private readonly aktivitaetenService: AktivitaetenService,

        @Inject(forwardRef(() => UserInteresseService))
        private readonly userInteressenService: UserInteresseService,

        @Inject(forwardRef(() => UserKalenderService))
        private readonly userKalenderService: UserKalenderService,

        @Inject(forwardRef(() => AuthService))
        private authService: AuthService

    ) { }


    create(user: User): Observable<any> {
        return this.authService.hashPassword(user.passwort).pipe(
            switchMap((passwordHash: string) => {

                const newUser = new UserEntity();
                newUser.username = user.username;
                newUser.email = user.email;
                newUser.passwort = passwordHash;
                newUser.vorname = user.vorname;
                newUser.nachname = user.nachname;
                newUser.zeitzone = user.zeitzone;
                newUser.role = UserRole.USER;
                newUser.interessens = [];

                return this.checkIfUserExists(newUser.username).pipe(switchMap((match: boolean) => {
                    if (match) {
                        throwError;
                        return null;
                    } else {
                        return from(this.userRepository.save(newUser)).pipe(
                            map((user: User) => {
                                const { passwort, ...result } = user;
                                return result;
                            })
                            ,
                            catchError(err => throwError(err))
                        )
                    }
                }))
            }))
    }

    checkIfUserExists(username: string): Observable<boolean> {
        return this.findOne(username).pipe(
            map((user: User) => {
                if (user != undefined) {
                    return true;
                } else {
                    return false;
                }
            }
            ))
    }

    findOne(username: string): Observable<User> {
        return from(this.userRepository.findOne({ username }));
    }

    findAll(): Observable<User[]> {
        return from(this.userRepository.find()).pipe(
            map((users: User[]) => {
                users.forEach(function (v) { delete v.passwort });
                return users;
            })
        );
    }

    deleteOne(username: string): Observable<any> {
        this.userKalenderService.deleteAllTiesToUser(username);
        this.userInteressenService.deleteAllTiesToUser(username);
        return from(this.userRepository.delete(username));
    }

    updateOne(username: string, user: User): Observable<any> {
        delete user.email;
        delete user.passwort;
        return from(this.userRepository.update(username, user));
    }

    login(user: User): Observable<string> {
        return this.validateUser(user.email, user.passwort).pipe(
            switchMap((user: User) => {
                if (user) {
                    return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt));
                } else {
                    return 'U';
                }
            })
        )
    }

    validateUser(email: string, passwort: string): Observable<User> {
        return this.findByMail(email).pipe(
            switchMap((user: User) => this.authService.comparePassword(passwort, user.passwort).pipe(
                map((match: boolean) => {
                    if (match) {
                        console.log("Eingegebenes Passwort für User: " + user.username + " stimmt überein.");
                        const { passwort, ...result } = user;
                        return result;
                    } else {
                        console.log("Falsches Passwort für User: " + user.username + ".");
                        return null;
                    }
                })
            ))
        )
    }

    findByMail(email: string): Observable<User> {
        return from(this.userRepository.findOne({ email }));
    }

    addTieToInteresse(username: string, interestID: number): void {
        this.userInteressenService.insertNewUserInteresseTie(interestID, username);
    }


    updateRoleOfUser(username: string, role: string): Observable<any> {
        var user = new UserEntity();
        const { passwort, ...result } = user;
        return this.findOne(username).pipe(switchMap((mappedUser: User) => {

            switch (role) {
                case UserRole.ADMIN: {
                    mappedUser.role = UserRole.ADMIN;
                    break;
                }
                case UserRole.USER: {
                    mappedUser.role = UserRole.USER;
                    break;
                } default: {
                    throw new Error("Incompatible User.Role");
                }
            }
            return from(this.userRepository.update(mappedUser.username, mappedUser));
        }));
    }

    findInteressenToUser(username: string): Observable<Interessen[]> {
        return this.interessenService.getInteresseToUser(username);
    }

    deleteTieFromInteresse(username: string, interestID: number): void {
        this.userInteressenService.deleteUserInteresseTie(interestID, username);

    }

    addTieToKalender(username: string, calendarID: number): void {
        this.userKalenderService.insertNewUserKalenderTie(calendarID, username);
    }

    findKalenderToUser(username: string): Observable<Kalender[]> {
        return this.kalenderService.getKalenderToUser(username);

    }

    removeTieFromKalender(username: string, calendarID: number) {
        this.userKalenderService.deleteUserKalenderTie(calendarID, username);
    }

    async getUsername(email: string): Promise<String> {
        let username: string;
        const user = await getConnection()
            .getRepository(UserEntity)
            .createQueryBuilder("user")
            .where("user.email = :email", { email: email })
            .getOne();
        username = String(user.username);
        return username;
    }

    /* This function return an Aktivitaeten Entity that is randdomized and based on the interests of the user, who is transfered. 
    */
    generateProposal(username: string): Observable<Aktivitaeten> {

        return this.findInteressenToUser(username).pipe(switchMap((interestsArray: Interessen[]) => {

            return this.aktivitaetenService.findAktivitaetenToInteresse(interestsArray[Math.floor(Math.random() * interestsArray.length)].interessenID)
                .pipe(map((activitiesArray: Aktivitaeten[]) => {
                    return activitiesArray[Math.floor(Math.random() * activitiesArray.length)];
                }
                ));

        }));
    }
}


