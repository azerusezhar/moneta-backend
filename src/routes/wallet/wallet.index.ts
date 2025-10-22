import { and, count, desc, eq } from "drizzle-orm";
import { createDb } from "../../db";
import { wallet } from "../../db/schema";
import { createRouter } from "../../lib/create-app";
import {
	createSuccessResponse,
	validateJson,
	validateParam,
	validateQuery,
} from "../../lib/validation";
import authGuard from "../../middlewares/auth-guard";
import {
	type CreateWalletRequest,
	createWalletSchema,
	type GetWalletsQuery,
	getWalletsQuerySchema,
	type UpdateWalletRequest,
	updateWalletSchema,
	type WalletIdParam,
	walletIdSchema,
} from "./wallet.schema";

const router = createRouter();

// GET /wallets - Get all wallets for authenticated user
router.get(
	"/wallets",
	authGuard,
	validateQuery(getWalletsQuerySchema, "Invalid query parameters"),
	async (c) => {
		const user = c.get("user");
		const query = c.req.valid("query") as GetWalletsQuery;
		const db = createDb((c.env as any).DATABASE_URL!);

		try {
			// Build where conditions
			const conditions = [eq(wallet.userId, user!.id)];

			if (query.isActive !== undefined) {
				conditions.push(eq(wallet.isActive, query.isActive));
			}

			// Get total count for pagination
			const [totalResult] = await db
				.select({ count: count() })
				.from(wallet)
				.where(and(...conditions));

			const total = totalResult.count;

			// Apply pagination
			const page = query.page || 1;
			const limit = query.limit || 20;
			const offset = (page - 1) * limit;

			// Get paginated wallets
			const wallets = await db
				.select()
				.from(wallet)
				.where(and(...conditions))
				.orderBy(desc(wallet.createdAt))
				.limit(limit)
				.offset(offset);

			const pagination = {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
				hasNext: offset + limit < total,
				hasPrev: page > 1,
			};

			return c.json(
				createSuccessResponse("Wallets retrieved successfully", {
					wallets,
					pagination,
				}),
			);
		} catch (error) {
			console.error("Error retrieving wallets:", error);
			return c.json(
				{
					success: false,
					error: {
						code: "INTERNAL_ERROR",
						message: "Failed to retrieve wallets",
					},
					message: "Internal server error",
				},
				500,
			);
		}
	},
);

// POST /wallets - Create a new wallet
router.post(
	"/wallets",
	authGuard,
	validateJson(createWalletSchema, "Invalid wallet data"),
	async (c) => {
		const user = c.get("user");
		const data = c.req.valid("json") as CreateWalletRequest;
		const db = createDb((c.env as any).DATABASE_URL!);

		try {
			// If this wallet is being set as default, unset other default wallets
			if (data.isDefault) {
				await db
					.update(wallet)
					.set({
						isDefault: false,
						updatedAt: new Date(),
					})
					.where(and(eq(wallet.userId, user!.id), eq(wallet.isDefault, true)));
			}

			// Insert new wallet
			const [newWallet] = await db
				.insert(wallet)
				.values({
					id: crypto.randomUUID(),
					userId: user!.id,
					name: data.name,
					balance: data.balance || "0.00",
					description: data.description,
					color: data.color || "bg-gray-800",
					icon: data.icon || "💰",
					isDefault: data.isDefault || false,
					accountNumber: data.accountNumber,
					institutionName: data.institutionName,
					createdAt: new Date(),
					updatedAt: new Date(),
				})
				.returning();

			return c.json(
				createSuccessResponse("Wallet created successfully", newWallet),
				201,
			);
		} catch (error) {
			console.error("Error creating wallet:", error);
			return c.json(
				{
					success: false,
					error: {
						code: "INTERNAL_ERROR",
						message: "Failed to create wallet",
					},
					message: "Internal server error",
				},
				500,
			);
		}
	},
);

// PUT /wallets/:walletId - Update wallet
router.put(
	"/wallets/:walletId",
	authGuard,
	validateParam(walletIdSchema, "Invalid wallet ID"),
	validateJson(updateWalletSchema, "Invalid wallet data"),
	async (c) => {
		const user = c.get("user");
		const params = c.req.valid("param") as WalletIdParam;
		const data = c.req.valid("json") as UpdateWalletRequest;
		const db = createDb((c.env as any).DATABASE_URL!);

		try {
			// Check if wallet exists and belongs to user
			const existingWallet = await db
				.select()
				.from(wallet)
				.where(
					and(eq(wallet.id, params.walletId), eq(wallet.userId, user!.id)),
				);

			if (existingWallet.length === 0) {
				return c.json(
					{
						success: false,
						error: {
							code: "NOT_FOUND",
							message:
								"Wallet not found or you don't have permission to access it",
						},
						message: "Resource not found",
					},
					404,
				);
			}

			// Prepare update data - only include provided fields
			const updateData: any = {
				updatedAt: new Date(),
			};

			if (data.name !== undefined) updateData.name = data.name;
			if (data.currency !== undefined) updateData.currency = data.currency;
			if (data.description !== undefined)
				updateData.description = data.description;
			if (data.color !== undefined) updateData.color = data.color;
			if (data.icon !== undefined) updateData.icon = data.icon;
			if (data.accountNumber !== undefined)
				updateData.accountNumber = data.accountNumber;
			if (data.institutionName !== undefined)
				updateData.institutionName = data.institutionName;
			if (data.isActive !== undefined) updateData.isActive = data.isActive;

			// Update wallet
			const [updatedWallet] = await db
				.update(wallet)
				.set(updateData)
				.where(and(eq(wallet.id, params.walletId), eq(wallet.userId, user!.id)))
				.returning();

			return c.json(
				createSuccessResponse("Wallet updated successfully", updatedWallet),
			);
		} catch (error) {
			console.error("Error updating wallet:", error);
			return c.json(
				{
					success: false,
					error: {
						code: "INTERNAL_ERROR",
						message: "Failed to update wallet",
					},
					message: "Internal server error",
				},
				500,
			);
		}
	},
);

// DELETE /wallets/:walletId - Delete wallet (hard delete)
router.delete(
	"/wallets/:walletId",
	authGuard,
	validateParam(walletIdSchema, "Invalid wallet ID"),
	async (c) => {
		const user = c.get("user");
		const params = c.req.valid("param") as WalletIdParam;
		const db = createDb((c.env as any).DATABASE_URL!);

		try {
			// Check if wallet exists and belongs to user
			const existingWallet = await db
				.select()
				.from(wallet)
				.where(
					and(eq(wallet.id, params.walletId), eq(wallet.userId, user!.id)),
				);

			if (existingWallet.length === 0) {
				return c.json(
					{
						success: false,
						error: {
							code: "NOT_FOUND",
							message:
								"Wallet not found or you don't have permission to access it",
						},
						message: "Resource not found",
					},
					404,
				);
			}

			// Check if wallet has active transactions
			// For now, we'll allow deletion - in a real app you'd check for active transactions
			// const hasActiveTransactions = await checkForActiveTransactions(params.walletId);
			const hasActiveTransactions = false;

			if (hasActiveTransactions) {
				return c.json(
					{
						success: false,
						error: {
							code: "CONFLICT",
							message: "Cannot delete wallet with active transactions",
						},
						message: "Conflict - Cannot delete wallet with active transactions",
					},
					409,
				);
			}

			// Perform hard delete (permanently remove from database)
			await db
				.delete(wallet)
				.where(
					and(eq(wallet.id, params.walletId), eq(wallet.userId, user!.id)),
				);

			return c.json(createSuccessResponse("Wallet deleted successfully"));
		} catch (error) {
			console.error("Error deleting wallet:", error);
			return c.json(
				{
					success: false,
					error: {
						code: "INTERNAL_ERROR",
						message: "Failed to delete wallet",
					},
					message: "Internal server error",
				},
				500,
			);
		}
	},
);

// PATCH /wallets/:walletId/set-default - Set wallet as default
router.patch(
	"/wallets/:walletId/set-default",
	authGuard,
	validateParam(walletIdSchema, "Invalid wallet ID"),
	async (c) => {
		const user = c.get("user");
		const params = c.req.valid("param") as WalletIdParam;
		const db = createDb((c.env as any).DATABASE_URL!);

		try {
			// Check if wallet exists and belongs to user
			const existingWallet = await db
				.select()
				.from(wallet)
				.where(
					and(
						eq(wallet.id, params.walletId),
						eq(wallet.userId, user!.id),
						eq(wallet.isActive, true), // Only active wallets can be set as default
					),
				);

			if (existingWallet.length === 0) {
				return c.json(
					{
						success: false,
						error: {
							code: "NOT_FOUND",
							message:
								"Wallet not found or you don't have permission to access it",
						},
						message: "Resource not found",
					},
					404,
				);
			}

			// Set all user's wallets isDefault to false
			await db
				.update(wallet)
				.set({
					isDefault: false,
					updatedAt: new Date(),
				})
				.where(eq(wallet.userId, user!.id));

			// Set specified wallet isDefault to true
			const [updatedWallet] = await db
				.update(wallet)
				.set({
					isDefault: true,
					updatedAt: new Date(),
				})
				.where(and(eq(wallet.id, params.walletId), eq(wallet.userId, user!.id)))
				.returning();

			return c.json(
				createSuccessResponse("Default wallet set successfully", updatedWallet),
			);
		} catch (error) {
			console.error("Error setting default wallet:", error);
			return c.json(
				{
					success: false,
					error: {
						code: "INTERNAL_ERROR",
						message: "Failed to set default wallet",
					},
					message: "Internal server error",
				},
				500,
			);
		}
	},
);

export default router;
