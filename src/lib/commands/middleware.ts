import { readConfig } from "src/config";
import { CommandHandler, UserCommandHandler } from "./command";
import { getUser } from "../db/queries/users";

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmdName: string, ...args: string[]): Promise<void> => {
        const username = readConfig().currentUserName;
        if (!username) {
            throw new Error("User not logged in");
        }

        const user = await getUser(username);
        if (!user) {
            throw new Error(`User ${username} not found`);
        }

        await handler(cmdName, user, ...args);
    }
}