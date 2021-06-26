import { AktivitaetenEntity } from "src/aktivitaeten/aktivitaeten.models/aktivitaeten.entity";
import { Aktivitaeten } from "src/aktivitaeten/aktivitaeten.models/aktivitaeten.interface";
import { InteressenAktivitaetenEntity } from "src/interessenAktivitaeten/interessenAktivitaeten.models/interessenAktivitaeten.entity";
import { User } from "src/user/user.models/user.interface";
import { UserInteresseEntity } from "src/userInteresse/userInteresse.models/userInteresse.entity";

export interface Interessen{
    interessenID: number;
    interessenBezeichnung: string;
    userInteressens: UserInteresseEntity[];
    aktivitaetens: InteressenAktivitaetenEntity[];
}