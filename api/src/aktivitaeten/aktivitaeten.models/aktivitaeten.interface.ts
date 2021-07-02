import { EreignisEntity } from "src/ereignis/ereignis.models/ereignis.entity";
import { InteressenAktivitaetenEntity } from "src/interessenAktivitaeten/interessenAktivitaeten.models/interessenAktivitaeten.entity";

export interface Aktivitaeten{
    aktivitaetenId?: number;
    aktivitaetsBezeichnung: string | null;
    aktivitaetsSatz: string | null;
    ereignis: EreignisEntity[];
    interessens?: InteressenAktivitaetenEntity[];
}


