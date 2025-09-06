import { listFeeds, createFeed, getFeedByUrl, createFeedFollow, getFeedFollowsForUser, deleteFeedFollow } from "../db/queries/feeds";
import { getUserById, getUser } from "../db/queries/users";
import { Feed, User } from "../db/schema/schema";
import { readConfig } from "../../config";
import { fetchFeed } from "../../feed";

export async function commandFeeds(cmdName: string, ...args: string[]): Promise<void> {
    const feeds = await listFeeds();
    if (!feeds) {
        console.log("No feeds to show");
        return;
    }

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

export async function commandAddfeed(cmdName: string, user: User, ...args: string[]): Promise<void> {
    if (args.length !== 2) {
        throw new Error("Missing arguments. Usage: addfeed <feed_name> <feed_url>");
    }

    const feedName = args[0], feedURL = args[1];
    const feed = await createFeed(feedName, feedURL, user.id);
    if (!feed) {
        throw new Error("Error adding feed");
    }

    const feedFollow = await createFeedFollow(user.id, feed.id);
    printFeed(feed, user);
    console.log(`${feedFollow.userName} is now follwing ${feedFollow.feedName}`);
}

async function printFeed(feed: Feed, user: User) {
    console.log("Successfully created feed:");
    Object.entries(feed).forEach(([k, v]) => console.log(`${k}: ${v}`));
    console.log("By user:");
    Object.entries(user).forEach(([k, v]) => console.log(`${k}: ${v}`));
}

export async function commandAgg(cmdName: string, ...args: string[]): Promise<void> {
    const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log(JSON.stringify(feed));
}

export async function commandFollow(cmdName: string, user: User, ...args: string[]): Promise<void> {
    if (args.length !== 1) {
        throw new Error("Must provide (only) one argument. Usage: follow <feed_url>");
    }

    const feedUrl = args[0];
    const feed = await getFeedByUrl(feedUrl);
    if (!feed) {
        throw new Error("Error: feed not found");
    }
    
    const feedFollow = await createFeedFollow(user.id, feed.id);
    console.log(`User ${feedFollow.userName} is now following feed ${feedFollow.feedName}`);
}

export async function commandFollowing(cmdName: string, user: User, ...args: string[]): Promise<void> {
    const follows = await getFeedFollowsForUser(user.id);
    if (follows.length === 0) {
        console.log(`${user.name} is not following any feed`);
        return;
    }

    console.log(`User ${user.name} is following:`)
    for (const feed of follows) {
        console.log(`* ${feed.feedName}`);
    }
}

export async function commandUnfollow(cmdName: string, user: User, ...args: string[]): Promise<void> {
    if (args.length !== 1) {
        throw new Error("Usage: unfollow <feed_url>");
    }

    const feedUrl = args[0];
    const unfollowedFeed = await deleteFeedFollow(user.id, feedUrl);
    console.log(`User ${user.name} is no longer following ${feedUrl}`);
}