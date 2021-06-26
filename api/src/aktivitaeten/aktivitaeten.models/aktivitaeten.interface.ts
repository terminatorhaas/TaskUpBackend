import { EreignisEntity } from "src/ereignis/ereignis.models/ereignis.entity";
import { Ereignis } from "src/ereignis/ereignis.models/ereignis.interface";
import { Interessen } from "src/interessen/interessen.models/interessen.interface";
import { InteressenAktivitaetenEntity } from "src/interessenAktivitaeten/interessenAktivitaeten.models/interessenAktivitaeten.entity";

export interface Aktivitaeten{
    aktivitaetenId?: number;
    aktivitaetsBezeichnung: string | null;
    aktivitaetsSatz: string | null;
    ereignis: EreignisEntity[];
    interessens?: InteressenAktivitaetenEntity[];
}


