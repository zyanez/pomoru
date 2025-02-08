DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `projects` ALTER COLUMN "created_at" TO "created_at" text NOT NULL DEFAULT (current_timestamp);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);