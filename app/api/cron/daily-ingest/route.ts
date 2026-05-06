import { NextResponse } from "next/server";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";
import { runDailyIngest } from "@/lib/pipeline/run-daily-ingest";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

async function handleCron(req: Request) {
  if (!process.env.CRON_SECRET?.trim()) {
    return NextResponse.json(
      { error: "CRON_SECRET is not configured" },
      { status: 503 },
    );
  }

  if (!isAuthorizedCronRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runDailyIngest();
  return NextResponse.json(result);
}

export function GET(req: Request) {
  return handleCron(req);
}

export function POST(req: Request) {
  return handleCron(req);
}
