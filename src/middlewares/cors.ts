import { cors } from "hono/cors";

export default cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowHeaders: ["Content-Type", "Authorization", "Cookie"],
  credentials: true,
});
