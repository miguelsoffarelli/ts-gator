import { setUser } from "../../config";
import { getUser } from "../db/queries/users";

export async function commandLogin(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length === 0) {
        throw new Error("Must provide a user name");
    }

    const username = args[0];
    const userExists = await getUser(username) ? true : false;

    if (!userExists) {
        throw new Error("User doesn't exist");
    }
    
    setUser(username);
    console.log(`User name set to ${username}`);
}