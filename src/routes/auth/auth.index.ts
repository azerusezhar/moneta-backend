import { createAuth } from "../../lib/auth";
import { createRouter } from "../../lib/create-app";

const router = createRouter().all("/auth/*", (c) => {
	const auth = createAuth(c.env as any);
	return auth.handler(c.req.raw);
});

export default router;
