import { setUser } from "./config";

export function commandLogin(cmdName: string, ...args: string[]): void {
    if (args.length === 0) {
        throw new Error("Must provide a user name");
    }

    const username = args[0];
    setUser(username);
    console.log(`User name set to ${username}`);
}