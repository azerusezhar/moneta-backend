import type { Session, User } from "better-auth";

export interface AppBindings {
  env: {
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    DATABASE_URL?: string;
    NODE_ENV?: string;
    RESEND_API_KEY?: string;
    FROM_EMAIL?: string;
  };
  Variables: {
    user: User | null;
    session: Session | null;
    auth: any;
  };
}
