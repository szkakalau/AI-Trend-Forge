import Link from "next/link";
import { redirect } from "next/navigation";
import { syncUserFromClerk } from "@/lib/sync-user";
import { prisma } from "@/lib/prisma";
import { canUseFavorites } from "@/lib/plans";
import { OpportunityCard } from "@/components/opportunity-card";
import { buttonVariants } from "@/components/ui/button";

export default async function FavoritesPage() {
  const user = await syncUserFromClerk();
  if (!user) redirect("/sign-in");

  const favoritesEnabled = canUseFavorites(user.plan);

  if (!favoritesEnabled) {
    return (
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-semibold">
          Favorites are a Pro feature
        </h1>
        <p className="text-muted-foreground">
          Upgrade to save opportunities, build shortlists, and move faster than copy-pasting links.
        </p>
        <Link href="/pricing" className={buttonVariants()}>
          View plans
        </Link>
      </div>
    );
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: { opportunity: true },
    orderBy: { createdAt: "desc" },
  });

  if (favorites.length === 0) {
    return (
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-semibold">
          No favorites yet
        </h1>
        <p className="text-muted-foreground">
          Heart ideas from the feed to keep a running backlog of builds worth validating.
        </p>
        <Link
          href="/dashboard"
          className={buttonVariants({ variant: "secondary" })}
        >
          Browse feed
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight">
          Saved ideas
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your shortlist of opportunities to stress-test this week.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {favorites.map((f) => (
          <OpportunityCard
            key={f.id}
            opp={{
              id: f.opportunity.id,
              slug: f.opportunity.slug,
              title: f.opportunity.title,
              score: f.opportunity.score,
              category: f.opportunity.category,
              pricingHint: f.opportunity.pricingHint,
              buildDifficulty: f.opportunity.buildDifficulty,
              sourcePlatform: f.opportunity.sourcePlatform,
              summary: f.opportunity.summary,
            }}
            favorited
            favoritesEnabled
          />
        ))}
      </div>
    </div>
  );
}
