import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getStripe, priceIdForPlan } from "@/lib/stripe";

export const dynamic = "force-dynamic";

function appOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { plan?: string };
  const plan = body.plan === "founder" ? "founder" : "pro";
  const priceId = priceIdForPlan(plan);
  if (!priceId) {
    return NextResponse.json(
      { error: "Stripe price ID not configured" },
      { status: 500 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) {
    return NextResponse.json({ error: "User not provisioned" }, { status: 400 });
  }

  const stripe = getStripe();

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const origin = appOrigin();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/dashboard?checkout=success`,
    cancel_url: `${origin}/pricing?checkout=cancel`,
    metadata: { userId: user.id },
    subscription_data: {
      metadata: { userId: user.id },
    },
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
