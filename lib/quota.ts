import { prisma } from "@/lib/prisma";
import { FREE_WEEKLY_DETAIL_UNLOCKS, isPaidPlan } from "@/lib/plans";
import { startOfUtcWeek } from "@/lib/week";

export type DetailAccess = "full" | "locked";

/**
 * Ensures the user may view full opportunity detail (paid = always).
 * Free: reuse existing unlock forever; otherwise consume one weekly slot for a new opportunity.
 */
export async function ensureDetailAccess(
  dbUserId: string,
  opportunityId: string,
  plan: string,
): Promise<DetailAccess> {
  if (isPaidPlan(plan)) return "full";

  const existing = await prisma.opportunityUnlock.findUnique({
    where: {
      userId_opportunityId: { userId: dbUserId, opportunityId },
    },
  });
  if (existing) return "full";

  const weekStart = startOfUtcWeek();
  const usedThisWeek = await prisma.opportunityUnlock.count({
    where: {
      userId: dbUserId,
      createdAt: { gte: weekStart },
    },
  });

  if (usedThisWeek >= FREE_WEEKLY_DETAIL_UNLOCKS) return "locked";

  await prisma.opportunityUnlock.create({
    data: { userId: dbUserId, opportunityId },
  });

  return "full";
}

export async function weeklyUnlocksUsed(dbUserId: string): Promise<number> {
  const weekStart = startOfUtcWeek();
  return prisma.opportunityUnlock.count({
    where: {
      userId: dbUserId,
      createdAt: { gte: weekStart },
    },
  });
}
