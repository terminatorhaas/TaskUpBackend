import { Interessen } from "src/interessen/interessen.models/interessen.interface";
import { KalenderEntity } from "src/kalender/kalender.models/kalender.entity";
import { Kalender } from "src/kalender/kalender.models/kalender.interface";

export interface User {
username?: string;
email?: string;
passwort?: string;
vorname?: string;
nachname?: string;
zeitzone?: string;
adminFlag?: boolean;
interessens?: Interessen[];
kalenders?: Kalender[];
}