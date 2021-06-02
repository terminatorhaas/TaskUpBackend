import { getRepository } from "typeorm"
import { Kalender } from "./entity/Kalender"

export const KalenderEinfuegen = async () => {
const kalenderRepo = getRepository(Kalender);
const kalender = kalenderRepo.create({bezeichnung: "Jeff69s Kalender"});
await kalenderRepo.save(kalender).catch((err) => {
    console.log("Fehler: ", err)
});
console.log("Neuen Kalender mit Namen ", kalender.bezeichnung, " eingefügt.")
}