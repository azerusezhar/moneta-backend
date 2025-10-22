import type { Context, Next } from "hono";
import type { AppBindings } from "../lib/types";

/**
 * Auth Guard Middleware - Requires authentication
 * Returns 401 if user is not authenticated
 */
export default function authGuard(c: Context<AppBindings>, next: Next) {
	const user = c.get("user");
	const session = c.get("session");
	
	if (!user || !session) {
		return c.json({
			status: "error",
			message: "Unauthorized",
			error: "Authentication required",
			code: "AUTHENTICATION_REQUIRED"
		}, 401);
	}
	
	return next();
}

/**
 * Optional Auth Guard Middleware - Works with or without authentication
 * Sets user/session if available, but doesn't require it
 */
export function optionalAuthGuard(c: Context<AppBindings>, next: Next) {
	const user = c.get("user");
	const session = c.get("session");
	
	// User is already set by withSession middleware
	// This is just for explicit documentation and future enhancements
	return next();
}

/**
 * Admin Guard Middleware - Requires admin role
 * Note: This requires role field to be added to user schema later
 */
export function adminGuard(c: Context<AppBindings>, next: Next) {
	const user = c.get("user");
	const session = c.get("session");
	
	if (!user || !session) {
		return c.json({
			status: "error",
			message: "Unauthorized",
			error: "Authentication required",
			code: "AUTHENTICATION_REQUIRED"
		}, 401);
	}
	
	// TODO: Add role check when role field is added to user schema
	// if (user.role !== "admin") {
	//   return c.json({
	//     status: "error",
	//     message: "Forbidden",
	//     error: "Admin access required",
	//     code: "INSUFFICIENT_PERMISSIONS"
	//   }, 403);
	// }
	
	return next();
}
