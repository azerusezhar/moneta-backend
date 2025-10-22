CREATE TYPE "public"."contribution_source" AS ENUM('manual_deposit', 'expense_savings', 'income_allocation', 'wallet_transfer', 'automated', 'other');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('receipt', 'invoice', 'bank_statement', 'credit_card_statement', 'investment_record', 'tax_document', 'contract', 'other');--> statement-breakpoint
CREATE TYPE "public"."expense_category" AS ENUM('food_dining', 'transportation', 'shopping', 'entertainment', 'bills_utilities', 'healthcare', 'education', 'travel', 'housing', 'insurance', 'personal_care', 'gifts_donations', 'business', 'taxes', 'investment', 'debt_payment', 'other');--> statement-breakpoint
CREATE TYPE "public"."income_category" AS ENUM('salary', 'freelance', 'business', 'investment', 'rental', 'pension', 'benefits', 'gift', 'bonus', 'refund', 'other');--> statement-breakpoint
CREATE TYPE "public"."saving_status" AS ENUM('active', 'completed', 'paused', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."saving_type" AS ENUM('short_term', 'long_term');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expense_id" text,
	"income_id" text,
	"name" text NOT NULL,
	"type" "document_type" NOT NULL,
	"description" text,
	"file_key" text NOT NULL,
	"file_name" text NOT NULL,
	"file_size" text,
	"mime_type" text NOT NULL,
	"document_date" timestamp,
	"processed_at" timestamp,
	"tags" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
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
	"ai_insights" text,
	"confidence_score" numeric(3, 2),
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
	"ai_insights" text,
	"confidence_score" numeric(3, 2),
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saving" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" "saving_type" NOT NULL,
	"status" "saving_status" DEFAULT 'active' NOT NULL,
	"target_amount" numeric(15, 2) NOT NULL,
	"current_amount" numeric(15, 2) DEFAULT '0.00' NOT NULL,
	"start_date" timestamp NOT NULL,
	"target_date" timestamp NOT NULL,
	"completed_date" timestamp,
	"monthly_target" numeric(15, 2),
	"weekly_target" numeric(15, 2),
	"icon" text DEFAULT '💰',
	"category" text,
	"priority" text DEFAULT 'medium',
	"notes" text,
	"ai_recommendations" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saving_contribution" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"saving_id" text NOT NULL,
	"wallet_id" text,
	"expense_id" text,
	"income_id" text,
	"amount" numeric(15, 2) NOT NULL,
	"source" "contribution_source" NOT NULL,
	"description" text,
	"notes" text,
	"original_expense_amount" numeric(15, 2),
	"saved_amount" numeric(15, 2),
	"contribution_date" timestamp NOT NULL,
	"is_automatic" boolean DEFAULT false NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "transfer" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"from_wallet_id" text NOT NULL,
	"to_wallet_id" text NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"description" text,
	"notes" text,
	"transfer_date" timestamp NOT NULL,
	"transfer_fee" numeric(15, 2) DEFAULT '0.00',
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "wallet" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"balance" numeric(15, 2) DEFAULT '0' NOT NULL,
	"description" text,
	"icon" text DEFAULT '💰',
	"is_active" boolean DEFAULT true NOT NULL,
	"account_number" text,
	"institution_name" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document" ADD CONSTRAINT "document_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document" ADD CONSTRAINT "document_expense_id_expense_id_fk" FOREIGN KEY ("expense_id") REFERENCES "public"."expense"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document" ADD CONSTRAINT "document_income_id_income_id_fk" FOREIGN KEY ("income_id") REFERENCES "public"."income"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense" ADD CONSTRAINT "expense_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense" ADD CONSTRAINT "expense_wallet_id_wallet_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallet"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "income" ADD CONSTRAINT "income_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "income" ADD CONSTRAINT "income_wallet_id_wallet_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallet"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saving" ADD CONSTRAINT "saving_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saving_contribution" ADD CONSTRAINT "saving_contribution_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saving_contribution" ADD CONSTRAINT "saving_contribution_saving_id_saving_id_fk" FOREIGN KEY ("saving_id") REFERENCES "public"."saving"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saving_contribution" ADD CONSTRAINT "saving_contribution_wallet_id_wallet_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallet"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saving_contribution" ADD CONSTRAINT "saving_contribution_expense_id_expense_id_fk" FOREIGN KEY ("expense_id") REFERENCES "public"."expense"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saving_contribution" ADD CONSTRAINT "saving_contribution_income_id_income_id_fk" FOREIGN KEY ("income_id") REFERENCES "public"."income"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transfer" ADD CONSTRAINT "transfer_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transfer" ADD CONSTRAINT "transfer_from_wallet_id_wallet_id_fk" FOREIGN KEY ("from_wallet_id") REFERENCES "public"."wallet"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transfer" ADD CONSTRAINT "transfer_to_wallet_id_wallet_id_fk" FOREIGN KEY ("to_wallet_id") REFERENCES "public"."wallet"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet" ADD CONSTRAINT "wallet_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "document_user_id_idx" ON "document" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "document_type_idx" ON "document" USING btree ("type");--> statement-breakpoint
CREATE INDEX "document_expense_id_idx" ON "document" USING btree ("expense_id");--> statement-breakpoint
CREATE INDEX "document_income_id_idx" ON "document" USING btree ("income_id");--> statement-breakpoint
CREATE INDEX "document_file_key_idx" ON "document" USING btree ("file_key");--> statement-breakpoint
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
CREATE INDEX "saving_user_id_idx" ON "saving" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "saving_type_idx" ON "saving" USING btree ("type");--> statement-breakpoint
CREATE INDEX "saving_status_idx" ON "saving" USING btree ("status");--> statement-breakpoint
CREATE INDEX "saving_target_date_idx" ON "saving" USING btree ("target_date");--> statement-breakpoint
CREATE INDEX "saving_contribution_user_id_idx" ON "saving_contribution" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "saving_contribution_saving_id_idx" ON "saving_contribution" USING btree ("saving_id");--> statement-breakpoint
CREATE INDEX "saving_contribution_wallet_id_idx" ON "saving_contribution" USING btree ("wallet_id");--> statement-breakpoint
CREATE INDEX "saving_contribution_expense_id_idx" ON "saving_contribution" USING btree ("expense_id");--> statement-breakpoint
CREATE INDEX "saving_contribution_income_id_idx" ON "saving_contribution" USING btree ("income_id");--> statement-breakpoint
CREATE INDEX "saving_contribution_date_idx" ON "saving_contribution" USING btree ("contribution_date");--> statement-breakpoint
CREATE INDEX "saving_contribution_source_idx" ON "saving_contribution" USING btree ("source");--> statement-breakpoint
CREATE INDEX "transfer_user_id_idx" ON "transfer" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "transfer_from_wallet_idx" ON "transfer" USING btree ("from_wallet_id");--> statement-breakpoint
CREATE INDEX "transfer_to_wallet_idx" ON "transfer" USING btree ("to_wallet_id");--> statement-breakpoint
CREATE INDEX "transfer_date_idx" ON "transfer" USING btree ("transfer_date");--> statement-breakpoint
CREATE INDEX "wallet_user_id_idx" ON "wallet" USING btree ("user_id");