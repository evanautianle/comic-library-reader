import { PrismaClient } from "./generated/prisma";

let _prisma: PrismaClient | null = null;

export function getPrisma(): PrismaClient {
  if (!_prisma) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error(
        "DATABASE_URL is not set in environment variables. " +
        "Make sure .env file exists in the backend directory and index.ts loads it with dotenv.config()"
      );
    }
    
    _prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });

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

// lazy init so dotenv loads first
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma();
    const value = (client as any)[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
