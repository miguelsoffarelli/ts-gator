import { readConfig, setUser } from "../../config";
import { 
    getUsers, 
    resetUsers, 
    createUser, 
    getUser ,
} from "../db/queries/users";

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

export async function commandRegister(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length === 0) {
        throw new Error("Must provide a user name");
    }

    const username = args[0];
    const userExists = await getUser(username) ? true : false;

    if (userExists) {
        throw new Error("User already exists");
    }

    const user = await createUser(username);
    setUser(user.name);
    
    console.log(`User ${user.name} successfully created`);
    console.log(`ID: ${user.id}`);
    console.log(`Name: ${user.name}`);
    console.log(`Created At: ${user.createdAt}`);
    console.log(`Updated At: ${user.updatedAt}`);
}

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

export async function commandReset(cmdName: string, ...args: string[]): Promise<void> {
    try {
        await resetUsers();
        console.log("Database reset successful");
    } catch(err) {
        console.error("Error resetting database");
    }
}