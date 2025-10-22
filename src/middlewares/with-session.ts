import type { Context, Next } from "hono";
import type { AppBindings } from "../lib/types";

export default async function withSession(c: Context<AppBindings>, next: Next) {
  try {
    const auth = c.get("auth");
    if (auth) {
      const session = await auth.api.getSession({
        headers: c.req.raw.headers,
      });
      
      if (session && session.user && session.session) {
        c.set("user", session.user);
        c.set("session", session.session);
      }
    }
  } catch (error) {
    // Session is optional, continue without it
  }
  
  await next();
}
