import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Function untuk membuat db instance dengan database URL
export function createDb(databaseUrl: string) {
  return drizzle(databaseUrl, { schema });
}

// Export default db untuk development (jika process.env tersedia)
export const db = drizzle(process.env.DATABASE_URL as string, { schema });
