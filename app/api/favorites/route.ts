import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { canUseFavorites } from "@/lib/plans";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) {
    return NextResponse.json({ error: "User not provisioned" }, { status: 400 });
  }

  if (!canUseFavorites(user.plan)) {
    return NextResponse.json(
      { error: "Favorites require Pro or Founder" },
      { status: 403 },
    );
  }

  const body = (await req.json()) as { opportunityId?: string };
  const opportunityId = body.opportunityId;
  if (!opportunityId) {
    return NextResponse.json({ error: "opportunityId required" }, { status: 400 });
  }

  const opp = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
  });
  if (!opp) {
    return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_opportunityId: { userId: user.id, opportunityId },
    },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ favorited: false });
  }

  await prisma.favorite.create({
    data: { userId: user.id, opportunityId },
  });

  return NextResponse.json({ favorited: true });
}
