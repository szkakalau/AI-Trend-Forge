import Link from "next/link";
import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import { CheckoutButton } from "@/components/checkout-button";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Pricing",
};

export default async function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary" className="mb-4">
          Simple plans
        </Badge>
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-tight md:text-5xl">
          Pricing that scales with your ship velocity
        </h1>
        <p className="mt-4 text-muted-foreground">
          Start free, upgrade when you want daily intelligence—not spreadsheets.
        </p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col border-border/80">
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription className="text-3xl font-semibold text-foreground">
              $0
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-3 text-sm text-muted-foreground">
            <p>3 ideas per week</p>
            <p>Limited previews</p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Show when="signed-out">
              <SignUpButton mode="modal">
                <Button className="w-full" variant="secondary">
                  Get Free Access
                </Button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link
                href="/dashboard"
                className={buttonVariants({
                  variant: "outline",
                  className: "w-full",
                })}
              >
                Open dashboard
              </Link>
            </Show>
          </CardFooter>
        </Card>

        <Card className="flex flex-col border-primary/45 shadow-xl shadow-primary/10">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle>Pro</CardTitle>
              <Badge>Popular</Badge>
            </div>
            <CardDescription className="text-3xl font-semibold text-foreground">
              $19/mo
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-3 text-sm text-muted-foreground">
            <p>Daily opportunities</p>
            <p>Full database</p>
            <p>Favorites</p>
            <p>Filters</p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button className="w-full">Sign in to upgrade</Button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <CheckoutButton planKey="pro" className="w-full">
                Upgrade to Pro
              </CheckoutButton>
            </Show>
          </CardFooter>
        </Card>

        <Card className="flex flex-col border-border/80">
          <CardHeader>
            <CardTitle>Founder</CardTitle>
            <CardDescription className="text-3xl font-semibold text-foreground">
              $49/mo
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-3 text-sm text-muted-foreground">
            <p>Everything in Pro</p>
            <p>Startup blueprints</p>
            <p>Launch prompts</p>
            <p>Growth playbooks</p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button className="w-full" variant="secondary">
                  Sign in to upgrade
                </Button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <CheckoutButton planKey="founder" variant="secondary" className="w-full">
                Upgrade to Founder
              </CheckoutButton>
            </Show>
          </CardFooter>
        </Card>
      </div>

      <p className="mt-12 text-center text-xs text-muted-foreground">
        Secure checkout powered by Stripe. Taxes may apply based on your region.
      </p>
    </main>
  );
}
