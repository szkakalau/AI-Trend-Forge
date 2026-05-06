import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOpportunitiesForFeed } from "@/lib/opportunities-feed";
import { prisma } from "@/lib/prisma";
import { weeklyUnlocksUsed } from "@/lib/quota";
import { canUseFavorites, FREE_WEEKLY_DETAIL_UNLOCKS } from "@/lib/plans";

export const dynamic = "force-dynamic";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) {
    return NextResponse.json({ error: "User not provisioned" }, { status: 400 });
  }

  const [feed, favorites, usedWeek] = await Promise.all([
    getOpportunitiesForFeed(),
    prisma.favorite.findMany({
      where: { userId: user.id },
      select: { opportunityId: true },
    }),
    weeklyUnlocksUsed(user.id),
  ]);

  const fav = new Set(favorites.map((f) => f.opportunityId));

  const rows = feed.map((o) => ({
    id: o.id,
    slug: o.slug,
    title: o.title,
    summary: o.summary,
    category: o.category,
    score: o.score,
    buildDifficulty: o.buildDifficulty,
    pricingHint: o.pricingHint,
    sourcePlatform: o.sourcePlatform,
  }));

  return NextResponse.json({
    plan: user.plan,
    weeklyUnlocksUsed: usedWeek,
    weeklyUnlockLimit: FREE_WEEKLY_DETAIL_UNLOCKS,
    favoritesEnabled: canUseFavorites(user.plan),
    favorites: [...fav],
    opportunities: rows,
  });
}
