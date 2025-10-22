import { zValidator } from "@hono/zod-validator";
import type { Context } from "hono";
import type { z } from "zod";

// Standard error response format
export interface ValidationError {
	status: "error";
	message: string;
	errors: Array<{
		path: string | number;
		message: string;
	}>;
}

// Standard success response format
export interface ApiResponse<T = unknown> {
	status: "success";
	message: string;
	data?: T;
}

/**
 * Creates a reusable zod validator with consistent error handling
 * @param target - The target to validate ('json', 'form', 'query', 'param', etc.)
 * @param schema - The zod schema to validate against
 * @param customErrorMessage - Optional custom error message for validation failures
 * @returns Hono middleware function
 */
export function createValidator<T extends z.ZodTypeAny>(
	target: "json" | "form" | "query" | "param" | "cookie" | "header",
	schema: T,
	customErrorMessage?: string,
) {
	return zValidator(target, schema, (result, c: Context) => {
		if (!result.success) {
			return c.json<ValidationError>(
				{
					status: "error",
					message: customErrorMessage || "Validation failed",
					errors: result.error.issues.map((issue) => ({
						path: issue.path.length > 0 ? String(issue.path[0]) : "root",
						message: issue.message,
					})),
				},
				400,
			);
		}
	});
}

/**
 * Creates a JSON validator - shorthand for the most common use case
 * @param schema - The zod schema to validate against
 * @param customErrorMessage - Optional custom error message
 * @returns Hono middleware function
 */
export function validateJson<T extends z.ZodTypeAny>(
	schema: T,
	customErrorMessage?: string,
) {
	return createValidator("json", schema, customErrorMessage);
}

/**
 * Creates a query parameter validator
 * @param schema - The zod schema to validate against
 * @param customErrorMessage - Optional custom error message
 * @returns Hono middleware function
 */
export function validateQuery<T extends z.ZodTypeAny>(
	schema: T,
	customErrorMessage?: string,
) {
	return createValidator("query", schema, customErrorMessage);
}

/**
 * Creates a form data validator
 * @param schema - The zod schema to validate against
 * @param customErrorMessage - Optional custom error message
 * @returns Hono middleware function
 */
export function validateForm<T extends z.ZodTypeAny>(
	schema: T,
	customErrorMessage?: string,
) {
	return createValidator("form", schema, customErrorMessage);
}

/**
 * Creates a path parameter validator
 * @param schema - The zod schema to validate against
 * @param customErrorMessage - Optional custom error message
 * @returns Hono middleware function
 */
export function validateParam<T extends z.ZodTypeAny>(
	schema: T,
	customErrorMessage?: string,
) {
	return createValidator("param", schema, customErrorMessage);
}

/**
 * Helper function to create success responses with consistent format
 * @param message - Success message
 * @param data - Optional data to include in response
 * @returns Formatted success response
 */
export function createSuccessResponse<T = unknown>(
	message: string,
	data?: T,
): ApiResponse<T> {
	return {
		status: "success",
		message,
		...(data && { data }),
	};
}

/**
 * Helper function to create error responses with consistent format
 * @param message - Error message
 * @param errors - Optional detailed error information
 * @returns Formatted error response
 */
export function createErrorResponse(
	message: string,
	errors?: Array<{ path: string | number; message: string }>,
): ValidationError {
	return {
		status: "error",
		message,
		errors: errors || [],
	};
}
