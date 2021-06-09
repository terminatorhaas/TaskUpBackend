import { Aktivitaeten } from "src/aktivitaeten/aktivitaeten.models/aktivitaeten.interface";
import { User } from "src/user/user.models/user.interface";

export interface Interessen{
    interessenId?: number;
    interessenBezeichnung?: string;
    users?: User[];
    aktivitaetens?: Aktivitaeten[];
}