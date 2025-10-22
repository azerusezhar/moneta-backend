import { Hono } from "hono";
import { requestId } from "hono/request-id";
import { parseEnv } from "../env";
import cors from "../middlewares/cors";
import notFound from "../middlewares/not-found";
import onError from "../middlewares/on-error";
import withSession from "../middlewares/with-session";
import { createAuth } from "./auth";
import type { AppBindings } from "./types";

export function createRouter() {
	return new Hono<AppBindings>({
		strict: false,
	});
}

export default function createApp() {
	const app = createRouter();
	app.use((c, next) => {
		c.env = parseEnv(Object.assign(c.env || {}, process.env));
		c.set("auth", createAuth(c.env as any));
		return next();
	});

	app.use("*", cors);
	app.use("*", withSession);

	app.use(requestId());
	app.onError(onError);
	app.notFound(notFound);
	return app;
}
