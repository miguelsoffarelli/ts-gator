import { fetchFeed } from "../../feed";

export async function commandAgg(cmdName: string, ...args: string[]): Promise<void> {
    const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log(JSON.stringify(feed));
}