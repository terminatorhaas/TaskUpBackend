export interface Ereignis{
    aktivitaetenId: number;
    ereignisId: number;
    kalenderId: number;
    bezeichnung: string | null;
    beginnDatumUhr: Date;
    endeDatumUhr: Date;
}

