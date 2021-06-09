import { Ereignis } from "src/ereignis/ereignis.models/ereignis.interface";
import { Interessen } from "src/interessen/interessen.models/interessen.interface";

export interface Aktivitaeten{
    aktivitaetenId?: number;
    aktivitaetsBezeichnung: string | null;
    aktivitaetsSatz: string | null;
    ereignis: Ereignis[];
    interessens?: Interessen[];
}


