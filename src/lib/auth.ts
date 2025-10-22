import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer, openAPI } from "better-auth/plugins";
import { Resend } from "resend";
import { createDb } from "../db";
import * as schema from "../db/schema";
import ForgotPasswordEmail from "../components/emails/forgot-password";
import type { AppBindings } from "./types";

export function createAuth(env: AppBindings["env"]) {
  const resend = new Resend(env.RESEND_API_KEY);
  
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
  }
  
  const db = createDb(env.DATABASE_URL);

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        ...schema,
      },
    }),
    emailAndPassword: {
      enabled: true,
      resetPasswordTokenExpiresIn: 60 * 60,
      sendResetPassword: async ({ user, url }) => {
        if (!env.RESEND_API_KEY) {
          console.warn("RESEND_API_KEY not configured, skipping email send");
          return;
        }

        try {
          await resend.emails.send({
            from: env.FROM_EMAIL || "noreply@moneta.dev",
            to: user.email,
            subject: "Reset Your Password - Moneta",
            react: ForgotPasswordEmail({
              resetLink: url,
              userName: user.name as string,
            }),
          });
          console.log(`Password reset email sent to ${user.email}`);
        } catch (error) {
          console.error("Failed to send password reset email:", error);
          throw new Error("Failed to send password reset email");
        }
      },
    },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24,
    updateAge: 60 * 60,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 20,
    customRules: {
      "/sign-in/email": {
        window: 60,
        max: 5,
      },
    },
  },
  secret: env.BETTER_AUTH_SECRET as string,
  baseURL: env.BETTER_AUTH_URL as string,
  trustedOrigins: [env.BETTER_AUTH_URL as string],
  plugins: [openAPI(), bearer()],
  });
}
