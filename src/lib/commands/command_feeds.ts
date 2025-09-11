import { listFeeds, createFeed, getFeedByUrl, createFeedFollow, getFeedFollowsForUser, deleteFeedFollow, getNextFeedToFetch, markFeedFetched, getFeedById } from "../db/queries/feeds";
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
    console.log(`${feedFollow.user_name} is now follwing ${feedFollow.feed_name}`);
}

async function printFeed(feed: Feed, user: User) {
    console.log("Successfully created feed:");
    Object.entries(feed).forEach(([k, v]) => console.log(`${k}: ${v}`));
    console.log("By user:");
    Object.entries(user).forEach(([k, v]) => console.log(`${k}: ${v}`));
}

export async function commandAgg(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length !== 1) {
        throw new Error("Usage: agg <time_between_reqs>");
    }

    const time_between_reqs = parseDuration(args[0]);
    console.log(`Collecting feeds every ${args[0]}`);
    await scrapeFeeds();

    const interval = setInterval(() => {
        scrapeFeeds().catch((e) => console.error(e));
    }, time_between_reqs);

    await new Promise<void>((resolve) => {
      process.on("SIGINT", () => {
        console.log("Shutting down feed aggregator...");
        clearInterval(interval);
        resolve();
      });
    });
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
    console.log(`User ${feedFollow.user_name} is now following feed ${feedFollow.feed_name}`);
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

export async function scrapeFeeds() {
    const nextFeed = await getNextFeedToFetch();
    const markedFeed = await markFeedFetched(nextFeed.id);
    const fetchedFeed = await fetchFeed(nextFeed.url);
    for (const item of fetchedFeed.channel.item) {
        console.log(item.title);
    }
}

function parseDuration(durationStr: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);
    if (!match) {
        throw new Error("invalid duration");
    }

    switch (match[2]) {
        case "ms":
            return Number(match[1]);
        case "s":
            return Number(match[1]) * 1000;
        case "m":
            return Number(match[1]) * 1000 * 60;
        case "h":
            return Number(match[1]) * 1000 * 3600;
        default:
            throw new Error("invalid duration");
    }
}