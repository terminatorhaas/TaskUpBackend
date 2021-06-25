import { Interessen } from "src/interessen/interessen.models/interessen.interface";
import { Kalender } from "src/kalender/kalender.models/kalender.interface";
import { UserInteresseEntity } from "src/userInteresse/userInteresse.models/userInteresse.entity";
import { UserKalenderEntity } from "src/userKalender/userKalender.models/userKalender.entity";

export interface User {
username?: string;
email?: string;
passwort?: string;
vorname?: string;
nachname?: string;
zeitzone?: string;
adminFlag?: boolean;
interessens?: UserInteresseEntity[];
kalenders?: UserKalenderEntity[];
role?: UserRole;
}

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
} 