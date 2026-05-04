import { loadEnvConfig } from "@next/env";
import { PrismaClient } from "@prisma/client";

// Ensure .env / .env.local are loaded before Prisma reads DATABASE_URL (ordering + bundling).
loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const databaseUrl = process.env.DATABASE_URL;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(databaseUrl ? { datasourceUrl: databaseUrl } : {}),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
