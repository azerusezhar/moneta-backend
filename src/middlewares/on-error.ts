import type { Context } from "hono";

export default function onError(err: Error, c: Context) {
  console.error("Error:", err);
  
  return c.json(
    {
      status: "error",
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
    },
    500
  );
}
