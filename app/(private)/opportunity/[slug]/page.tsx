import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { syncUserFromClerk } from "@/lib/sync-user";
import { prisma } from "@/lib/prisma";
import { ensureDetailAccess } from "@/lib/quota";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckoutButton } from "@/components/checkout-button";
import { PLANS } from "@/lib/plans";

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await syncUserFromClerk();
  if (!user) redirect("/sign-in");

  const opp = await prisma.opportunity.findUnique({ where: { slug } });
  if (!opp || opp.status !== "active") notFound();

  const access = await ensureDetailAccess(user.id, opp.id, user.plan);
  const locked = access === "locked";

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">
          ← Back to feed
        </Link>
        <span className="hidden sm:inline">/</span>
        <span>{opp.category}</span>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{opp.sourcePlatform}</Badge>
          <Badge>Pain score {opp.score}</Badge>
          <Badge variant="secondary">{opp.buildDifficulty}</Badge>
        </div>
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-tight md:text-5xl">
          {opp.title}
        </h1>
        {opp.landingHeadline ? (
          <p className="text-lg text-muted-foreground">{opp.landingHeadline}</p>
        ) : null}
      </div>

      {locked ? (
        <Card className="border-primary/30 bg-muted/20">
          <CardHeader>
            <CardTitle className="font-[family-name:var(--font-heading)] text-xl">
              Weekly unlock limit reached
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Free accounts unlock three full opportunity briefs per week. Upgrade for unlimited
              access, favorites, and founder playbooks.
            </p>
            <p className="text-sm font-medium">Preview</p>
            <p className="text-sm text-muted-foreground">{opp.summary}</p>
            <div className="flex flex-wrap gap-3">
              <CheckoutButton planKey="pro">Upgrade to Pro</CheckoutButton>
              <Link
                href="/pricing"
                className={buttonVariants({ variant: "outline" })}
              >
                Compare plans
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {!locked ? (
        <>
          <section className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">User pain summary</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {opp.painPoint}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Why now</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {opp.whyNow ?? "Momentum is building as buyers adopt lightweight AI workflows."}
              </CardContent>
            </Card>
          </section>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ideal customer (ICP)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {opp.icp ?? opp.targetUser}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">MVP features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                {opp.mvpFeatures.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pricing suggestion</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {opp.pricingHint}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Launch channels</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {opp.launchChannels.map((ch) => (
                  <Badge key={ch} variant="secondary">
                    {ch}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Go-to-market</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {opp.goToMarket ?? opp.summary}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reddit launch idea</CardTitle>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap text-sm text-muted-foreground">
              {opp.redditLaunch ?? "Lead with a builder-native story: problem, demo GIF, ask for harsh feedback."}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">SaaS potential</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {opp.saasPotential ??
                "Recurring value via workflows, seats, or usage-based credits once retention hooks exist."}
            </CardContent>
          </Card>

          {user.plan === PLANS.FOUNDER ? (
            <Card className="border-primary/35">
              <CardHeader>
                <CardTitle className="font-[family-name:var(--font-heading)] text-lg">
                  Founder blueprint pack
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Ship a landing in 48 hours: headline tests from this brief, 3 ICP-specific hero
                  variants, and a pricing ladder mapped to your MVP scope.
                </p>
                <Separator />
                <ul className="list-inside list-disc space-y-2">
                  <li>Launch checklist: distribution, analytics, and feedback loops</li>
                  <li>Growth prompts for Reddit, PH, and micro-influencer outreach</li>
                  <li>Retention hooks tied to the pain score signals above</li>
                </ul>
              </CardContent>
            </Card>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
