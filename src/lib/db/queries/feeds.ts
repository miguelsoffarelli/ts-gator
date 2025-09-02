import { UUID } from "crypto";
import { db } from "..";
import { feeds } from "../schema/schema";

export async function createFeed(feedName: string, feedURL: string, userID: string) {
    const [result] = await db.insert(feeds).values({
        name: feedName,
        url: feedURL,
        user_id: userID,
    }).returning();
    return result;
}

export async function listFeeds() {
    const result = await db.select().from(feeds);
    return result;
}