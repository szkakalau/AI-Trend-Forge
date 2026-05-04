import Stripe from "stripe";

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(key, { typescript: true });
}

export function priceIdForPlan(plan: "pro" | "founder"): string | null {
  const id =
    plan === "pro"
      ? process.env.STRIPE_PRICE_PRO
      : process.env.STRIPE_PRICE_FOUNDER;
  return id ?? null;
}

export function planFromPriceId(priceId: string): "pro" | "founder" | null {
  if (priceId === process.env.STRIPE_PRICE_PRO) return "pro";
  if (priceId === process.env.STRIPE_PRICE_FOUNDER) return "founder";
  return null;
}
