import { pgTable, timestamp, uuid, text, unique } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});

export const feeds = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  user_id: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  last_fetched_at: timestamp("last_fetched_at"),
});

export const feedFollows = pgTable("feed_follows", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  user_id: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  feed_id: uuid("feed_id").references(() => feeds.id, { onDelete: "cascade" }).notNull(),
}, (table) => {
  return {
    userFeedUnique: unique("user_feed_unique").on(table.user_id, table.feed_id),
  };
});



export type Feed = typeof feeds.$inferSelect;
export type User = typeof users.$inferSelect;
export type FeedFollows = typeof feedFollows.$inferSelect;