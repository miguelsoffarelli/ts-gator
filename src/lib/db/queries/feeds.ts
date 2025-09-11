import { UUID } from "crypto";
import { db } from "..";
import { feedFollows, feeds, users } from "../schema/schema";
import { and, eq, sql } from "drizzle-orm";
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
    const [result] = await db.select({
        id: feedFollows.id,
        created_at: feedFollows.created_at,
        updated_at: feedFollows.updated_at,
        userID: feedFollows.user_id,
        feedID: feedFollows.feed_id,
        user_name: users.name,
        feed_name: feeds.name,
    }).from(feedFollows)
    .innerJoin(users, eq(feedFollows.user_id, users.id))
    .innerJoin(feeds, eq(feedFollows.feed_id, feeds.id))
    .where(eq(feedFollows.id, newFeedFollow.id));
    return result;
}

export async function getFeedFollowsForUser(userID: string) {
    const result = await db.select({
        id: feedFollows.id,
        created_at: feedFollows.created_at,
        updated_at: feedFollows.updated_at,
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

export async function deleteFeedFollow(userId: string, feedUrl: string) {
    const [feed] = await db.select().from(feeds).where(eq(feeds.url, feedUrl));
    if (!feed) {
        throw new Error("Feed not found");
    }

    const [result] = await db.delete(feedFollows)
    .where(and(eq(feedFollows.user_id, userId), eq(feedFollows.feed_id, feed.id)))
    .returning();
    return result;
}

export async function markFeedFetched(feedId: string) {
    const result = await db.update(feeds).set({
        last_fetched_at: new Date(),
        updated_at: new Date(),
    })
    .where(eq(feeds.id, feedId));
    return result;
}

export async function getNextFeedToFetch(){
    const [result] = await db.select().from(feeds).orderBy(sql`${feeds.last_fetched_at} ASC NULLS FIRST`, feeds.created_at).limit(1);
    return result;
}