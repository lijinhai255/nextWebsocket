import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// 定义 notes 表
export const notes = pgTable("notes", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
