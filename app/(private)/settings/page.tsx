import Link from "next/link";
import { redirect } from "next/navigation";
import { isUserBillingExempt } from "@/lib/billing-exempt";
import { syncUserFromClerk } from "@/lib/sync-user";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SettingsPage() {
  const user = await syncUserFromClerk();
  if (!user) redirect("/sign-in");

  const billingExempt = isUserBillingExempt({
    billingExemptFromStripe: user.billingExemptFromStripe,
    email: user.email,
  });

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-semibold">
          Settings
        </h1>
        <p className="mt-2 text-muted-foreground">
          Account basics pulled from Clerk—billing upgrades route through Stripe checkout.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plan</CardTitle>
          <CardDescription>Active Entitlements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Current</span>
            <Badge className="capitalize">{user.plan}</Badge>
          </div>
          {billingExempt ? (
            <p className="text-sm text-muted-foreground">
              当前套餐由管理员手动授予，不会随 Stripe 订阅事件自动变更。
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Need more unlocks, favorites, or founder playbooks? Jump to pricing anytime.
            </p>
          )}
          <Link
            href="/pricing"
            className={buttonVariants({ variant: "secondary" })}
          >
            Manage upgrade
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Managed via Clerk</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="text-foreground">Email:</span> {user.email ?? "—"}
          </p>
          <p>
            <span className="text-foreground">Name:</span> {user.name ?? "—"}
          </p>
          <p className="pt-2">
            Use the avatar menu in the header to update profile details and security settings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
