import { resetUsers } from "./db/queries/users";

export async function commandReset(cmdName: string, ...args: string[]): Promise<void> {
    try {
        await resetUsers();
        console.log("Database reset successful");
    } catch(err) {
        console.error("Error resetting database");
    }
}