import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
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

  const [rows, favorites, usedWeek] = await Promise.all([
    prisma.opportunity.findMany({
      where: { status: "active" },
      orderBy: { score: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        category: true,
        score: true,
        buildDifficulty: true,
        pricingHint: true,
        sourcePlatform: true,
      },
    }),
    prisma.favorite.findMany({
      where: { userId: user.id },
      select: { opportunityId: true },
    }),
    weeklyUnlocksUsed(user.id),
  ]);

  const fav = new Set(favorites.map((f) => f.opportunityId));

  return NextResponse.json({
    plan: user.plan,
    weeklyUnlocksUsed: usedWeek,
    weeklyUnlockLimit: FREE_WEEKLY_DETAIL_UNLOCKS,
    favoritesEnabled: canUseFavorites(user.plan),
    favorites: [...fav],
    opportunities: rows,
  });
}
