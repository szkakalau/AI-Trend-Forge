import type { Opportunity } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/** Minimum cards before we supplement with historical high-scorers (UTC "today" first). */
const MIN_CARDS = 6;

export function utcDayStart(d = new Date()): Date {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

/** Prefer opportunities created today (UTC); if fewer than MIN_CARDS, fill from all-time active by score. */
export async function getOpportunitiesForFeed(): Promise<Opportunity[]> {
  const start = utcDayStart();
  const today = await prisma.opportunity.findMany({
    where: { status: "active", createdAt: { gte: start } },
    orderBy: { score: "desc" },
  });

  if (today.length >= MIN_CARDS) return today;

  const ids = new Set(today.map((o) => o.id));
  const need = MIN_CARDS - today.length;
  const fallback = await prisma.opportunity.findMany({
    where: {
      status: "active",
      ...(ids.size ? { id: { notIn: [...ids] } } : {}),
    },
    orderBy: { score: "desc" },
    take: Math.max(need, 24),
  });

  return [...today, ...fallback];
}
