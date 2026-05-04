import Link from "next/link";
import { redirect } from "next/navigation";
import { syncUserFromClerk } from "@/lib/sync-user";
import { prisma } from "@/lib/prisma";
import { OpportunityCard } from "@/components/opportunity-card";
import { canUseFavorites, FREE_WEEKLY_DETAIL_UNLOCKS } from "@/lib/plans";
import { weeklyUnlocksUsed } from "@/lib/quota";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export default async function DashboardPage() {
  const user = await syncUserFromClerk();
  if (!user) redirect("/sign-in");

  const [opportunities, favorites, usedWeek] = await Promise.all([
    prisma.opportunity.findMany({
      where: { status: "active" },
      orderBy: { score: "desc" },
    }),
    prisma.favorite.findMany({ where: { userId: user.id } }),
    weeklyUnlocksUsed(user.id),
  ]);

  const favSet = new Set(favorites.map((f) => f.opportunityId));
  const favoritesEnabled = canUseFavorites(user.plan);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight md:text-4xl">
            Daily AI opportunities
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Ranked by pain score, monetization hints, and build difficulty—pick a lane and ship.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="capitalize">
            Plan · {user.plan}
          </Badge>
          {user.plan === "free" ? (
            <Badge variant="secondary">
              Detail unlocks this week: {usedWeek}/{FREE_WEEKLY_DETAIL_UNLOCKS}
            </Badge>
          ) : null}
          <Link
            href="/pricing"
            className={buttonVariants({ size: "sm", variant: "secondary" })}
          >
            Upgrade
          </Link>
        </div>
      </div>

      {!favoritesEnabled ? (
        <p className="rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
          Favorites unlock on Pro—save ideas while you explore verticals.
        </p>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        {opportunities.map((opp) => (
          <OpportunityCard
            key={opp.id}
            opp={{
              id: opp.id,
              slug: opp.slug,
              title: opp.title,
              score: opp.score,
              category: opp.category,
              pricingHint: opp.pricingHint,
              buildDifficulty: opp.buildDifficulty,
              sourcePlatform: opp.sourcePlatform,
              summary: opp.summary,
            }}
            favorited={favSet.has(opp.id)}
            favoritesEnabled={favoritesEnabled}
          />
        ))}
      </div>
    </div>
  );
}
