import { readConfig } from "../../config";
import { createFeed } from "../db/queries/feeds";
import { getUser } from "../db/queries/users";
import { Feed, User } from "../db/schema/schema";

export async function commandAddfeed(cmdName: string, ...args: string[]): Promise<void> {
    const currentUser = await getUser(readConfig().currentUserName);
    if (!currentUser) {
        throw new Error("Error fetching current user");
    }

    if (args.length !== 2) {
        throw new Error("Missing arguments. Usage: addfeed <feed name> <feed url>");
    }

    const feedName = args[0], feedURL = args[1];
    const feed = await createFeed(feedName, feedURL, currentUser.id);
    printFeed(feed, currentUser);
}

async function printFeed(feed: Feed, user: User) {
    console.log("Successfully created feed:");
    Object.entries(feed).forEach(([k, v]) => console.log(`${k}: ${v}`));
    console.log("By user:");
    Object.entries(user).forEach(([k, v]) => console.log(`${k}: ${v}`));
}