DROP TABLE "document" CASCADE;--> statement-breakpoint
DROP TABLE "expense" CASCADE;--> statement-breakpoint
DROP TABLE "income" CASCADE;--> statement-breakpoint
DROP TABLE "saving" CASCADE;--> statement-breakpoint
DROP TABLE "saving_contribution" CASCADE;--> statement-breakpoint
DROP TABLE "transfer" CASCADE;--> statement-breakpoint
DROP TABLE "wallet" CASCADE;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text DEFAULT 'user' NOT NULL;--> statement-breakpoint
DROP TYPE "public"."contribution_source";--> statement-breakpoint
DROP TYPE "public"."document_type";--> statement-breakpoint
DROP TYPE "public"."expense_category";--> statement-breakpoint
DROP TYPE "public"."income_category";--> statement-breakpoint
DROP TYPE "public"."saving_status";--> statement-breakpoint
DROP TYPE "public"."saving_type";