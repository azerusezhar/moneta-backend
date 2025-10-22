CREATE TYPE "public"."wallet_color" AS ENUM('bg-gray-800', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500');--> statement-breakpoint
CREATE TABLE "expense" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"wallet_id" text NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"category" text NOT NULL,
	"description" text,
	"notes" text,
	"merchant" text,
	"location" text,
	"transaction_date" timestamp NOT NULL,
	"is_recurring" boolean DEFAULT false NOT NULL,
	"recurring_pattern" text,
	"tags" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "income" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"wallet_id" text NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"category" text NOT NULL,
	"description" text,
	"notes" text,
	"source" text,
	"transaction_date" timestamp NOT NULL,
	"is_recurring" boolean DEFAULT false NOT NULL,
	"recurring_pattern" text,
	"is_taxable" boolean DEFAULT false NOT NULL,
	"tax_year" text,
	"tags" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wallet" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"balance" numeric(15, 2) DEFAULT '0' NOT NULL,
	"description" text,
	"color" "wallet_color" NOT NULL,
	"icon" text DEFAULT '💰',
	"is_active" boolean DEFAULT true NOT NULL,
	"institution_name" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "expense" ADD CONSTRAINT "expense_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense" ADD CONSTRAINT "expense_wallet_id_wallet_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallet"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "income" ADD CONSTRAINT "income_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "income" ADD CONSTRAINT "income_wallet_id_wallet_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallet"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet" ADD CONSTRAINT "wallet_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "expense_user_id_idx" ON "expense" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "expense_wallet_id_idx" ON "expense" USING btree ("wallet_id");--> statement-breakpoint
CREATE INDEX "expense_category_idx" ON "expense" USING btree ("category");--> statement-breakpoint
CREATE INDEX "expense_transaction_date_idx" ON "expense" USING btree ("transaction_date");--> statement-breakpoint
CREATE INDEX "expense_merchant_idx" ON "expense" USING btree ("merchant");--> statement-breakpoint
CREATE INDEX "income_user_id_idx" ON "income" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "income_wallet_id_idx" ON "income" USING btree ("wallet_id");--> statement-breakpoint
CREATE INDEX "income_category_idx" ON "income" USING btree ("category");--> statement-breakpoint
CREATE INDEX "income_transaction_date_idx" ON "income" USING btree ("transaction_date");--> statement-breakpoint
CREATE INDEX "income_source_idx" ON "income" USING btree ("source");--> statement-breakpoint
CREATE INDEX "wallet_user_id_idx" ON "wallet" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "role";