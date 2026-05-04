import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { ensureDetailAccess } from "@/lib/quota";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) {
    return NextResponse.json({ error: "User not provisioned" }, { status: 400 });
  }

  const opp = await prisma.opportunity.findUnique({ where: { slug } });
  if (!opp || opp.status !== "active") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const access = await ensureDetailAccess(user.id, opp.id, user.plan);
  if (access === "locked") {
    return NextResponse.json({
      locked: true,
      teaser: {
        title: opp.title,
        slug: opp.slug,
        summary: opp.summary,
        score: opp.score,
        category: opp.category,
      },
    });
  }

  return NextResponse.json({
    locked: false,
    opportunity: opp,
  });
}
