import { getMaxListeners } from "process";
import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import { UserEinfuegen } from "./UserEinfuegen";
import { KalenderEinfuegen } from "./KalenderEinfuegen";

createConnection().then(async connection => {

/*    console.log("Inserting a new user into the database...");
    const user = new User();
    user.username = "Jeff";
    user.email = "jeff@gmail.com"
    user.passwort = "Geoff11"
    user.vorname = "Jeffrey"
    user.nachname = "Anderson"
    user.zeitzone = "UTC"
    user.adminFlag = false;
    await connection.manager.save(user);
    console.log("Saved a new user with uname: " + user.username);

    console.log("Loading users from the database...");
    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);

    console.log("Here you can setup and run express/koa/any other framework.");
    */

    UserEinfuegen().catch((err) => { console.log(err);});
     



}).catch(error => console.log(error));

