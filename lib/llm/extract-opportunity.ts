import { chatCompletionJson } from "@/lib/llm/client";

export type ClassifyResult = {
  relevant: boolean;
};

export type ExtractedOpportunityPayload = {
  title: string;
  summary: string;
  painPoint: string;
  targetUser: string;
  category: string;
  buildDifficulty: string;
  pricingHint: string;
  launchChannels: string[];
  mvpFeatures: string[];
  whyNow?: string | null;
  icp?: string | null;
  redditLaunch?: string | null;
  saasPotential?: string | null;
  goToMarket?: string | null;
  landingHeadline?: string | null;
  painScore: number;
  buyIntent: number;
  urgency: number;
  aiBuildability: number;
  competition: number;
  finalScore: number;
};

function clampInt(n: unknown, lo: number, hi: number): number {
  const x = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(x)) return lo;
  return Math.min(hi, Math.max(lo, Math.round(x)));
}

function parseJsonObject(raw: string): Record<string, unknown> {
  const parsed = JSON.parse(raw) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("LLM JSON was not an object");
  }
  return parsed as Record<string, unknown>;
}

export async function classifyAiProductOpportunity(input: {
  platform: string;
  title: string;
  body: string;
  url: string;
}): Promise<ClassifyResult> {
  const text = `${input.title}\nURL: ${input.url}\n\n${input.body}`.slice(0, 12_000);
  const content = await chatCompletionJson([
    {
      role: "system",
      content: `You screen posts for an indie founder tool. Decide if the text describes a concrete software/product opportunity that could realistically be built with AI assistance (new SaaS, tool, app, API product, automation, vertical AI—not pure news, politics, hiring threads, or generic discussion without a product angle).
Respond with JSON only: {"relevant":true|false}`,
    },
    {
      role: "user",
      content: `Platform: ${input.platform}\n\nPost:\n${text}`,
    },
  ]);

  const obj = parseJsonObject(content);
  return { relevant: Boolean(obj.relevant) };
}

export async function extractStructuredOpportunity(input: {
  platform: string;
  title: string;
  body: string;
  url: string;
}): Promise<ExtractedOpportunityPayload> {
  const text = `${input.title}\nURL: ${input.url}\n\n${input.body}`.slice(0, 14_000);
  const content = await chatCompletionJson([
    {
      role: "system",
      content: `You convert a community post into a structured indie AI product brief. Use ONLY evidence from the post; do not invent metrics or fake testimonials.
Return JSON with keys:
title (concise product-style name),
summary (2 sentences),
painPoint,
targetUser,
category (short label),
buildDifficulty (e.g. Low, Medium, Medium–High),
pricingHint (short text),
launchChannels (string array, 3–6 channels),
mvpFeatures (string array, 3–6 bullets),
whyNow, icp, redditLaunch, saasPotential, goToMarket, landingHeadline (optional strings or null),
painScore, buyIntent, urgency, aiBuildability, competition, finalScore — integers 0–100 (finalScore should reflect overall opportunity strength).`,
    },
    {
      role: "user",
      content: `Platform: ${input.platform}\n\nPost:\n${text}`,
    },
  ]);

  const o = parseJsonObject(content);
  const launchChannels = Array.isArray(o.launchChannels)
    ? (o.launchChannels as unknown[]).map((x) => String(x)).filter(Boolean)
    : [];
  const mvpFeatures = Array.isArray(o.mvpFeatures)
    ? (o.mvpFeatures as unknown[]).map((x) => String(x)).filter(Boolean)
    : [];

  const titleStr = String(o.title ?? "").trim() || input.title.trim();
  const payload: ExtractedOpportunityPayload = {
    title: titleStr.slice(0, 200),
    summary: String(o.summary ?? "").trim().slice(0, 2000),
    painPoint: String(o.painPoint ?? "").trim().slice(0, 2000),
    targetUser: String(o.targetUser ?? "").trim().slice(0, 1500),
    category: String(o.category ?? "General").trim().slice(0, 120),
    buildDifficulty: String(o.buildDifficulty ?? "Medium").trim().slice(0, 80),
    pricingHint: String(o.pricingHint ?? "").trim().slice(0, 500),
    launchChannels: launchChannels.slice(0, 12),
    mvpFeatures: mvpFeatures.slice(0, 12),
    whyNow: o.whyNow != null ? String(o.whyNow).slice(0, 2000) : null,
    icp: o.icp != null ? String(o.icp).slice(0, 1500) : null,
    redditLaunch: o.redditLaunch != null ? String(o.redditLaunch).slice(0, 2500) : null,
    saasPotential: o.saasPotential != null ? String(o.saasPotential).slice(0, 2000) : null,
    goToMarket: o.goToMarket != null ? String(o.goToMarket).slice(0, 2000) : null,
    landingHeadline:
      o.landingHeadline != null ? String(o.landingHeadline).slice(0, 300) : null,
    painScore: clampInt(o.painScore, 0, 100),
    buyIntent: clampInt(o.buyIntent, 0, 100),
    urgency: clampInt(o.urgency, 0, 100),
    aiBuildability: clampInt(o.aiBuildability, 0, 100),
    competition: clampInt(o.competition, 0, 100),
    finalScore: clampInt(o.finalScore, 0, 100),
  };

  if (!payload.summary || !payload.painPoint) {
    throw new Error("LLM extract missing required fields");
  }
  if (payload.launchChannels.length === 0) {
    payload.launchChannels = [input.platform];
  }
  if (payload.mvpFeatures.length === 0) {
    payload.mvpFeatures = ["Ship an MVP landing page", "Collect waitlist", "Iterate from feedback"];
  }

  return payload;
}
