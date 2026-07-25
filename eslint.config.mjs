import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
    // Build output and generated code, not part of the lintable source.
    globalIgnores([".next/", "prisma/generated/", "next-env.d.ts"]),
    {
        extends: [...nextCoreWebVitals],
    },
]);
