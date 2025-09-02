import { listFeeds } from "../db/queries/feeds";
import { getUserById } from "../db/queries/users";

export async function commandFeeds(cmdName: string, ...args: string[]): Promise<void> {
    const feeds = await listFeeds();
    for (const feed of feeds) {
        const user = await getUserById(feed.user_id);
        console.log(
`Name: ${feed.name}
URL: ${feed.url}
Created by user: ${user.name}
===============================================`
);
    }
}