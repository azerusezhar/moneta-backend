import { createAuth } from "../../lib/auth";
import { createRouter } from "../../lib/create-app";

const router = createRouter().all("/auth/*", async (c) => {
	const auth = createAuth(c.env as any);
	const response = await auth.handler(c.req.raw);
	
	// Log the response for debugging
	console.log("Auth response status:", response.status);
	console.log("Auth response headers:", Object.fromEntries(response.headers.entries()));
	
	return response;
});

export default router;
