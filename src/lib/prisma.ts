import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";
import path from "path";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const getDatabaseUrl = () => {
  const envUrl = process.env.DATABASE_URL || "file:./dev.db";
  if (envUrl.startsWith("file:")) {
    const dbPath = envUrl.replace("file:", "").replace(/^["']|["']$/g, "");
    return `file:${path.resolve(process.cwd(), dbPath)}`;
  }
  return envUrl;
};

const adapter = new PrismaBetterSqlite3({
  url: getDatabaseUrl(),
});

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
