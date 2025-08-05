import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "process";
import { PrismaClient } from "../../generated/prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
export const db = new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;