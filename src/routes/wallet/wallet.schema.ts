import z from "zod";

// Wallet Type Enum
export const walletTypeSchema = z.enum([
	"checking",
	"savings",
	"credit_card",
	"investment",
	"cash",
	"digital_wallet",
	"loan",
	"other",
]);

// Get Wallets Query Parameters
export const getWalletsQuerySchema = z.object({
	type: walletTypeSchema.optional(),
	isActive: z.coerce.boolean().optional(),
	page: z.coerce.number().int().min(1).default(1).optional(),
	limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
});

// Create Wallet Request Schema
export const createWalletSchema = z.object({
	name: z.string().min(1).max(100),
	type: walletTypeSchema,
	currency: z
		.string()
		.regex(/^[A-Z]{3}$/)
		.default("IDR")
		.optional(),
	balance: z
		.string()
		.regex(/^\d+(\.\d{1,2})?$/)
		.default("0.00")
		.optional(),
	description: z.string().max(500).optional(),
	color: z
		.enum([
			"bg-gray-800",
			"bg-purple-500",
			"bg-red-500",
			"bg-yellow-500",
			"bg-green-500",
			"bg-blue-500",
		])
		.optional(),
	icon: z.string().optional(),
	accountNumber: z.string().max(50).optional(),
	institutionName: z.string().max(100).optional(),
	isDefault: z.boolean().default(false).optional(),
});

// Update Wallet Request Schema
export const updateWalletSchema = z.object({
	name: z.string().min(1).max(100).optional(),
	type: walletTypeSchema.optional(),
	currency: z
		.string()
		.regex(/^[A-Z]{3}$/)
		.optional(),
	description: z.string().max(500).nullable().optional(),
	color: z
		.enum([
			"bg-gray-800",
			"bg-purple-500",
			"bg-red-500",
			"bg-yellow-500",
			"bg-green-500",
			"bg-blue-500",
		])
		.optional(),
	icon: z.string().optional(),
	accountNumber: z.string().max(50).nullable().optional(),
	institutionName: z.string().max(100).nullable().optional(),
	isActive: z.boolean().optional(),
});

// Wallet ID Parameter Schema
export const walletIdSchema = z.object({
	walletId: z.string().uuid(),
});

// Type exports for TypeScript
export type WalletType = z.infer<typeof walletTypeSchema>;
export type GetWalletsQuery = z.infer<typeof getWalletsQuerySchema>;
export type CreateWalletRequest = z.infer<typeof createWalletSchema>;
export type UpdateWalletRequest = z.infer<typeof updateWalletSchema>;
export type WalletIdParam = z.infer<typeof walletIdSchema>;
