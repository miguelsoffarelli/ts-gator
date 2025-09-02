import { UUID } from "crypto";
import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
    const req = await fetch(feedURL, {
        method: "GET",
        headers: {
            "User-Agent": "gator",
        },
    });

    const res = await req.text();
    const parser = new XMLParser();
    const xmlFeed = parser.parse(res);
    const feedObj = xmlFeed.rss;

    if (!feedObj.channel) {
        throw new Error("no channel found");
    }

    if (!feedObj.channel.title || !feedObj.channel.description || !feedObj.channel.link) {
        throw new Error("not enough info to display rss feed");
    }

    const title: string = feedObj.channel.title, link: string = feedObj.channel.link, description: string = feedObj.channel.description;
    let items: RSSItem[] = [];

    if (feedObj.channel.item) {
        const xmlItems = Array.isArray(feedObj.channel.item) ? feedObj.channel.item : [ feedObj.channel.item ];

        for (const i of xmlItems) {
            if (i.title?.trim() && i.link?.trim() && i.description?.trim() && i.pubDate?.trim()) {
                items.push({
                    title: i.title.trim(),
                    link: i.link.trim(),
                    description: i.description.trim(),
                    pubDate: i.pubDate.trim(),
                })
            }
        }
    }

    const feed: RSSFeed = {
        channel: {
            title: title,
            link: link,
            description: description,
            item: items,
        }
    }

    return feed;
}

