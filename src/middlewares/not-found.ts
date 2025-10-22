import type { Context, Next } from "hono";

export default async function notFound(c: Context) {
  return c.json(
    {
      status: "error",
      message: "Not Found",
      error: "The requested resource was not found",
    },
    404
  );
}
