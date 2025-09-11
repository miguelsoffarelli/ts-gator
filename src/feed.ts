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
    const res = await fetch(feedURL, { headers: { "User-Agent": "gator" } });
    if (!res.ok) {
        console.warn("Bad status", res.status, feedURL);
        return { channel: { title: "", link: "", description: "", item: [] } };
    }

    let xml: string;
    try {
        xml = await res.text();
    } catch (e) {
        console.warn("Failed to read body", feedURL, e);
        return { channel: { title: "", link: "", description: "", item: [] } };
    }

    let parsed: any;
    try {
        parsed = new XMLParser().parse(xml);
    } catch (e) {
        console.warn("XML parse error", feedURL, e);
        return { channel: { title: "", link: "", description: "", item: [] } };
    }

    const feedObj = parsed?.rss;
    if (!feedObj?.channel) {
        console.warn("No rss.channel", feedURL);
        return { channel: { title: "", link: "", description: "", item: [] } };
    }

    if (!feedObj.channel.title || !feedObj.channel.description || !feedObj.channel.link) {
        console.warn("not enough info to display rss feed");
        return { channel: { title: "", link: "", description: "", item: [] } };
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

