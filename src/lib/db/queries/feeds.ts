import { UUID } from "crypto";
import { db } from "..";
import { feedFollows, feeds, users } from "../schema/schema";
import { eq } from "drizzle-orm";
import { getUserById } from "./users";

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

export async function getFeedById(feedID: string) {
    const [result] = await db.select().from(feeds).where(eq(feeds.id, feedID));
    return result;
}

export async function getFeedByUrl(feedURL: string) {
    const [result] = await db.select().from(feeds).where(eq(feeds.url, feedURL));
    return result;
}

export async function createFeedFollow(userID: string, feedID: string) {
    const [newFeedFollow] = await db.insert(feedFollows).values({
        user_id: userID,
        feed_id: feedID,
    }).returning();
    const result = await db.select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        userID: feedFollows.user_id,
        feedID: feedFollows.feed_id,
        userName: users.name,
        feedName: feeds.name,
    }).from(feedFollows)
    .innerJoin(users, eq(feedFollows.user_id, users.id))
    .innerJoin(feeds, eq(feedFollows.feed_id, feeds.id))
    .where(eq(feedFollows.id, newFeedFollow.id));
    return result;
}

export async function getFeedFollowsForUser(userID: string) {
    const result = await db.select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        userID: feedFollows.user_id,
        feedID: feedFollows.feed_id,
        userName: users.name,
        feedName: feeds.name,
    }).from(feedFollows)
    .innerJoin(users, eq(feedFollows.user_id, users.id))
    .innerJoin(feeds, eq(feedFollows.feed_id, feeds.id))
    .where(eq(feedFollows.user_id, userID));
    return result;
}