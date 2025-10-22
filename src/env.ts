export function parseEnv(env: Record<string, any>) {
  return {
    BETTER_AUTH_SECRET: env.BETTER_AUTH_SECRET || "your-secret-key",
    BETTER_AUTH_URL: env.BETTER_AUTH_URL || "http://localhost:8787",
    GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
    DATABASE_URL: env.DATABASE_URL,
    NODE_ENV: env.NODE_ENV || "development",
    RESEND_API_KEY: env.RESEND_API_KEY,
    FROM_EMAIL: env.FROM_EMAIL || "noreply@moneta.dev",
  };
}
