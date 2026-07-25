// Prisma 7 CLI configuration. The CLI no longer auto-loads .env, so
// dotenv is imported explicitly; it does not override variables already
// present in the environment (e.g. in CI or on Vercel).
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        url: env("DATABASE_URL"),
        // Only needed by `migrate diff --from-migrations` (the CI drift
        // check); plain `migrate deploy` runs fine without it.
        ...(process.env.SHADOW_DATABASE_URL
            ? { shadowDatabaseUrl: env("SHADOW_DATABASE_URL") }
            : {}),
    },
});
