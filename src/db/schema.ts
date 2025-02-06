import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
    id: text("id").primaryKey().notNull(),
    email: text("email").unique().notNull(),
    name: text("name").notNull(),
    numberOfProjects: integer("numberOfProjects").default(0).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const projectsTable = sqliteTable("projects", {
    id: integer("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").default("DEFAULT").notNull(),
    type: text("type").notNull(),
    completed: integer("completed", { mode: "boolean" }).default(false).notNull(),
    archived: integer("archived", { mode: "boolean" }).default(false).notNull(),
    ownerId: text("owner_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    workedTime: integer("workedTime").default(0).notNull(),
    restedTime: integer("restedTime").default(0).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const tasksTable = sqliteTable("tasks", {
    id: integer("id").primaryKey(),
    title: text("title").notNull(),
    completed: integer("completed", { mode: "boolean" }).default(false).notNull(),
    important: integer("important").default(0).notNull(),
    projectId: integer("project_id").notNull().references(() => projectsTable.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertProject = typeof projectsTable.$inferInsert;
export type SelectProject = typeof projectsTable.$inferSelect;

export type InsertTask = typeof tasksTable.$inferInsert;
export type SelectTask = typeof tasksTable.$inferSelect;

