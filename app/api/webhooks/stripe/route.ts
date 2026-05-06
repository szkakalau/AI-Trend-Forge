import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { isUserBillingExempt } from "@/lib/billing-exempt";
import { prisma } from "@/lib/prisma";
import { getStripe, planFromPriceId } from "@/lib/stripe";

export const dynamic = "force-dynamic";

async function syncActiveSubscription(sub: Stripe.Subscription) {
  const userId = sub.metadata?.userId;
  if (!userId) return;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { billingExemptFromStripe: true, email: true },
  });
  if (user && isUserBillingExempt(user)) {
    return;
  }

  const priceId = sub.items.data[0]?.price?.id as string | undefined;
  const mapped = priceId ? planFromPriceId(priceId) : null;

  const active = sub.status === "active" || sub.status === "trialing";
  const plan = active && mapped ? mapped : "free";

  await prisma.user.update({
    where: { id: userId },
    data: { plan },
  });

  if (sub.id) {
    await prisma.subscription.upsert({
      where: { stripeSubscriptionId: sub.id },
      create: {
        userId,
        plan: active && mapped ? mapped : "free",
        status: sub.status,
        stripeSubscriptionId: sub.id,
      },
      update: {
        plan: active && mapped ? mapped : "free",
        status: sub.status,
      },
    });
  }
}

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET not set" },
      { status: 500 },
    );
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id;
        if (userId && customerId) {
          await prisma.user.update({
            where: { id: userId },
            data: { stripeCustomerId: customerId },
          });
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        await syncActiveSubscription(sub);
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (userId) {
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { billingExemptFromStripe: true, email: true },
          });
          const exempt = user && isUserBillingExempt(user);
          if (!exempt) {
            await prisma.user.update({
              where: { id: userId },
              data: { plan: "free" },
            });
            if (sub.id) {
              await prisma.subscription.updateMany({
                where: { stripeSubscriptionId: sub.id },
                data: { status: "canceled", plan: "free" },
              });
            }
          }
        }
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error("Stripe webhook handler error", e);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
