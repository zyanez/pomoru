import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
    id: text("id").primaryKey().notNull(),
    email: text("email").unique().notNull(),
    name: text("name").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const projectsTable = sqliteTable("projects", {
    id: integer("id").primaryKey(),
    name: text("name").notNull(),
    type: text("type").notNull(),
    completed: integer("completed").default(0).notNull(),
    ownerId: text("owner_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const tasksTable = sqliteTable("tasks", {
    id: integer("id").primaryKey(),
    title: text("title").notNull(),
    completed: integer("completed").default(0).notNull(),
    tag: text("tag").notNull(),
    important: integer("important").default(0).notNull(),
    projectId: integer("project_id").notNull().references(() => projectsTable.id, { onDelete: "cascade" }),
    dueDate: integer("due_date", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const projectSharesTable = sqliteTable("project_shares", {
    id: integer("id").primaryKey(),
    projectId: integer("project_id").notNull().references(() => projectsTable.id, { onDelete: "cascade" }),
    userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    sharedAt: integer("shared_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertProject = typeof projectsTable.$inferInsert;
export type SelectProject = typeof projectsTable.$inferSelect;

export type InsertTask = typeof tasksTable.$inferInsert;
export type SelectTask = typeof tasksTable.$inferSelect;

export type InsertProjectShare = typeof projectSharesTable.$inferInsert;
export type SelectProjectShare = typeof projectSharesTable.$inferSelect;
