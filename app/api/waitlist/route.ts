import { NextResponse } from "next/server";
import { isDatabaseUrlUnsetOrPlaceholder } from "@/lib/database-env";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  if (isDatabaseUrlUnsetOrPlaceholder()) {
    return NextResponse.json(
      { error: "Waitlist is unavailable until DATABASE_URL is configured." },
      { status: 503 },
    );
  }

  try {
    const body = (await req.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await prisma.waitlist.upsert({
      where: { email },
      create: { email },
      update: {},
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
