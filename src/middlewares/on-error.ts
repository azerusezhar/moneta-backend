import type { Context } from "hono";
import type { AppBindings } from "../lib/types";

export default function onError(err: Error, c: Context<AppBindings>) {
  console.error("Error:", err);
  console.error("Error stack:", err.stack);
  console.error("Request URL:", c.req.url);
  console.error("Request method:", c.req.method);
  console.error("Request headers:", Object.fromEntries(c.req.raw.headers.entries()));
  
  const isDevelopment = (c.env as any)?.NODE_ENV === "development";
  
  return c.json(
    {
      status: "error",
      message: "Internal Server Error",
      error: isDevelopment ? err.message : "Something went wrong",
    },
    500
  );
}
