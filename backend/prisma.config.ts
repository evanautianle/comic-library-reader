import dotenv from "dotenv";
import { resolve } from "path";
import { defineConfig } from "prisma/config";

dotenv.config({ path: resolve(process.cwd(), ".env") });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in environment variables. Make sure .env file exists in the backend directory.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
