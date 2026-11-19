import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Local development reads .env.local. On Vercel, variables are already in process.env.
config({ path: ".env.local" });
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Schema changes work best over a direct (non-pooled) connection.
    url: process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_URL ?? "",
  },
});
