import { createRouter } from "../lib/create-app";
import { createSuccessResponse, validateJson } from "../lib/validation";

const router = createRouter();

router.get("/", (c) => {
	return c.json(
		{ status: "success", message: "Hello From Moneta Backend" },
		200,
	);
});

export default router;
