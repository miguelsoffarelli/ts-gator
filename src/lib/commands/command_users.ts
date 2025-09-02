import { readConfig } from "../../config";
import { getUsers } from "../db/queries/users";

export async function commandUsers(cmdName: string, ...args: string[]): Promise<void> {
    const users = await getUsers();

    if (users.length === 0) {
        console.log("No registered users in database");
        return;
    }

    const currentUser = readConfig().currentUserName;

    for (const user of users) {
        let msg = `* ${user.name}`;
        
        if (user.name === currentUser) {
            msg = msg + " (current)";
        }

        console.log(msg);
    }
}