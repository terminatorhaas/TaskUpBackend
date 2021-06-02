import { getRepository } from "typeorm"
import { User } from "./entity/User"
import { Kalender } from "./entity/Kalender"

export const UserEinfuegen = async () => {
const userRepo = getRepository(User);
const user = userRepo.create({  username: "Peter5", 
                                email: "peter2@me.com",
                                passwort: "PeterPeter123",
                                vorname: "Peter",
                                nachname: "Markworth",
                                zeitzone: "GMT",
                                adminFlag: true });
await userRepo.save(user).catch((err) => {
    console.log("Fehler: ", err)
});
console.log("Neuen User mit Namen ", user.username, " eingefügt.")


//User-Array erstellen (für Kalender-Bindung gemacht)
var usersArray:User[] = [user];

//Erstellung & Verknüpfung von Kalender
const kalenderRepo = getRepository(Kalender);
const kalender = new Kalender();
kalender.bezeichnung = "Peter5s Kalender";
kalender.users = usersArray;

await kalenderRepo.save(kalender).catch((err) => console.log("Fehler: ", err));


};