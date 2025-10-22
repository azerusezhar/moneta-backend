import {
  boolean,
  decimal,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const walletColorEnum = pgEnum("wallet_color", [
  "bg-gray-800",
  "bg-purple-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-blue-500",
]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const wallet = pgTable(
  "wallet",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    balance: decimal("balance", { precision: 15, scale: 2 })
      .notNull()
      .default("0"),
    description: text("description"),
    color: walletColorEnum("color").notNull(),
    icon: text("icon").default("💰"), // Emoji
    isActive: boolean("is_active").notNull().default(true),
    isDefault: boolean("is_default").notNull().default(false),
    accountNumber: text("account_number"),
    institutionName: text("institution_name"),
    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [index("wallet_user_id_idx").on(table.userId)]
);

export const expense = pgTable(
  "expense",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    walletId: text("wallet_id")
      .notNull()
      .references(() => wallet.id, { onDelete: "cascade" }),
    amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
    category: text("category").notNull(),
    description: text("description"),
    notes: text("notes"),
    merchant: text("merchant"), // Store/vendor name
    location: text("location"), // Where the expense occurred
    transactionDate: timestamp("transaction_date").notNull(),
    isRecurring: boolean("is_recurring").notNull().default(false),
    recurringPattern: text("recurring_pattern"), // monthly, weekly, etc.
    tags: text("tags"), // JSON array of tags
    // Metadata
    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index("expense_user_id_idx").on(table.userId),
    index("expense_wallet_id_idx").on(table.walletId),
    index("expense_category_idx").on(table.category),
    index("expense_transaction_date_idx").on(table.transactionDate),
    index("expense_merchant_idx").on(table.merchant),
  ]
);

export const income = pgTable(
  "income",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    walletId: text("wallet_id")
      .notNull()
      .references(() => wallet.id, { onDelete: "cascade" }),
    amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
    category: text("category").notNull(),
    description: text("description"),
    notes: text("notes"),
    source: text("source"), // Company, client, etc.
    // Transaction details
    transactionDate: timestamp("transaction_date").notNull(),
    isRecurring: boolean("is_recurring").notNull().default(false),
    recurringPattern: text("recurring_pattern"), // monthly, weekly, etc.
    // Tax information
    isTaxable: boolean("is_taxable").notNull().default(false),
    taxYear: text("tax_year"), 
    tags: text("tags"), 
    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index("income_user_id_idx").on(table.userId),
    index("income_wallet_id_idx").on(table.walletId),
    index("income_category_idx").on(table.category),
    index("income_transaction_date_idx").on(table.transactionDate),
    index("income_source_idx").on(table.source),
  ]
);