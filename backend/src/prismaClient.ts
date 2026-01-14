import { PrismaClient } from "@prisma/client";

// Single Prisma client instance for the app (lazy-init)
let _prisma: PrismaClient | null = null;

export function getPrisma(): PrismaClient {
  if (!_prisma) {
    _prisma = new PrismaClient();

    // Optional: handle SIGINT to disconnect cleanly in dev
    if (process.env.NODE_ENV !== "production") {
      process.on("SIGINT", async () => {
        try {
          await _prisma?.$disconnect();
        } finally {
          process.exit(0);
        }
      });
    }
  }
  return _prisma;
}

// Backwards-compatible named export
export const prisma = getPrisma();
