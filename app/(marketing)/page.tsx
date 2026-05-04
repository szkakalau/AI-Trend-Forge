import Link from "next/link";
import { Show, SignUpButton } from "@clerk/nextjs";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WaitlistForm } from "@/components/waitlist-form";

export default async function LandingPage() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-20 md:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6">
              Opportunity intelligence for indie builders
            </Badge>
            <h1 className="font-[family-name:var(--font-heading)] text-balance text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              Find Winning AI Product Ideas Before Everyone Else
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
              We scan Reddit, Product Hunt and online communities daily to uncover
              AI tools users actually want and founders can build fast.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Show when="signed-out">
                <SignUpButton mode="modal">
                  <Button size="lg" className="min-w-[200px]">
                    Get Free Access
                  </Button>
                </SignUpButton>
              </Show>
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ size: "lg", variant: "secondary" }),
                  "min-w-[200px]",
                )}
              >
                See Today&apos;s Ideas
              </Link>
            </div>
          </div>

          <p className="mx-auto mt-16 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-sm text-muted-foreground">
            <span>Updated Daily</span>
            <span className="hidden sm:inline">•</span>
            <span>Real User Pain Points</span>
            <span className="hidden sm:inline">•</span>
            <span>Buildable This Week</span>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight">
              Today&apos;s Top AI Opportunities
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Preview signals from the live feed—unlock the full database inside the product.
            </p>
          </div>
          <Link
            href="/pricing"
            className={buttonVariants({ variant: "outline" })}
          >
            Unlock Full Database
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Card className="border-border/80 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-[family-name:var(--font-heading)] text-xl">
                AI Resume Tailor Tool
              </CardTitle>
              <CardDescription>Pain Score: 92</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">Fast to monetize</Badge>
            </CardContent>
          </Card>
          <Card className="border-border/80 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-[family-name:var(--font-heading)] text-xl">
                AI Cold Email Personalizer
              </CardTitle>
              <CardDescription>Pain Score: 89</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">High demand</Badge>
            </CardContent>
          </Card>
          <Card className="border-border/80 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-[family-name:var(--font-heading)] text-xl">
                AI YouTube Clip Generator
              </CardTitle>
              <CardDescription>Pain Score: 86</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">Creator market</Badge>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-y border-border/60 bg-muted/20 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight">
            How It Works
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "Step 1",
                title: "We scan online communities daily",
                body: "Signals from Reddit, Product Hunt, and indie forums hit one pipeline.",
              },
              {
                step: "Step 2",
                title: "AI scores demand, urgency and monetization potential",
                body: "Every idea gets a pain score you can sort, filter, and compare.",
              },
              {
                step: "Step 3",
                title: "You launch faster using ready-made blueprints",
                body: "MVP scope, pricing hints, and GTM channels—ready for your builder stack.",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl border border-border/80 bg-background/60 p-6">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {item.step}
                </p>
                <h3 className="mt-3 font-[family-name:var(--font-heading)] text-xl font-semibold">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-center font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight">
          Pricing
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription className="text-2xl font-semibold text-foreground">
                $0
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>3 ideas per week</p>
              <p>Limited previews</p>
            </CardContent>
          </Card>
          <Card className="border-primary/40 shadow-lg shadow-primary/10">
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription className="text-2xl font-semibold text-foreground">
                $19/mo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Daily opportunities</p>
              <p>Full database</p>
              <p>Favorites</p>
              <p>Filters</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Founder</CardTitle>
              <CardDescription className="text-2xl font-semibold text-foreground">
                $49/mo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Everything in Pro</p>
              <p>Startup blueprints</p>
              <p>Launch prompts</p>
              <p>Growth playbooks</p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-10 flex justify-center">
          <Link href="/pricing" className={buttonVariants({ size: "lg" })}>
            Compare plans
          </Link>
        </div>
      </section>

      <section className="border-t border-border/60 bg-muted/15 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold">
            Get launch alerts
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Join the waitlist for weekly drops—no spam, unsubscribe anytime.
          </p>
          <div className="mt-8">
            <WaitlistForm />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-24 text-center">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight md:text-4xl">
          Don&apos;t Build Random AI Products.
          <br />
          Build What People Already Want.
        </h2>
        <div className="mt-8 flex justify-center gap-3">
          <Show when="signed-out">
            <SignUpButton mode="modal">
              <Button size="lg">Get Free Access</Button>
            </SignUpButton>
          </Show>
          <Link
            href="/pricing"
            className={buttonVariants({ size: "lg", variant: "secondary" })}
          >
            View pricing
          </Link>
        </div>
      </section>
    </main>
  );
}
