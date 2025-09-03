import { listFeeds, createFeed, getFeedByUrl, createFeedFollow, getFeedFollowsForUser } from "../db/queries/feeds";
import { getUserById, getUser } from "../db/queries/users";
import { Feed, User } from "../db/schema/schema";
import { readConfig } from "../../config";
import { fetchFeed } from "../../feed";

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
    const feedFollow = await createFeedFollow(currentUser.id, feed.id);
    printFeed(feed, currentUser);
    console.log(`${currentUser.name} is now follwing ${feed.name}`);
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

export async function commandFollow(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length !== 1) {
        throw new Error("Must provide (only) one argument. Usage: follow <feed url>");
    }

    const feedUrl = args[0];
    const feed = await getFeedByUrl(feedUrl);
    const user = await getUser(readConfig().currentUserName);
    const feedFollow = await createFeedFollow(user.id, feed.id);
    console.log(`User ${user.name} is now following feed ${feed.name}`);
}

export async function commandFollowing(cmdName: string, ...args: string[]): Promise<void> {
    const currentUser = await getUser(readConfig().currentUserName);
    const feeds = await getFeedFollowsForUser(currentUser.id);
    console.log(`User ${currentUser.name} is following:`)
    for (const feed of feeds) {
        console.log(feed.feedName);
    }
}