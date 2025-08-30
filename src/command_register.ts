import { setUser } from "./config";
import { createUser, getUser } from "./db/queries/users";

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