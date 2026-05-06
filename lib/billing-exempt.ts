/**
 * Users marked exempt keep their `plan` as set manually; Stripe webhooks do not overwrite it.
 * Use DB `billingExemptFromStripe` for durable grants; optional `BILLING_EXEMPT_EMAILS` for env-only overrides.
 */

function parseExemptEmailsFromEnv(): Set<string> {
  const raw = process.env.BILLING_EXEMPT_EMAILS ?? "";
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isEmailInBillingExemptEnv(email: string | null | undefined): boolean {
  if (!email) return false;
  return parseExemptEmailsFromEnv().has(email.trim().toLowerCase());
}

export function isUserBillingExempt(user: {
  billingExemptFromStripe: boolean;
  email: string | null;
}): boolean {
  return user.billingExemptFromStripe || isEmailInBillingExemptEnv(user.email);
}
