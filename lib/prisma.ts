import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient() {
  // The pg library currently treats sslmode=require as verify-full and prints a warning about
  // a future change. Saying "verify-full" out loud keeps today's exact behavior and silences it.
  const connectionString = (process.env.POSTGRES_URL ?? "").replace("sslmode=require", "sslmode=verify-full");
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
