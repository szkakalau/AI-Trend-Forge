import { Prisma } from "@prisma/client";
import { fetchHackerNewsPosts } from "@/lib/ingest/hackernews";
import { fetchProductHuntPosts } from "@/lib/ingest/producthunt";
import { fetchRedditPosts } from "@/lib/ingest/reddit";
import type { NormalizedPost } from "@/lib/ingest/types";
import {
  classifyAiProductOpportunity,
  extractStructuredOpportunity,
} from "@/lib/llm/extract-opportunity";
import { allocateOpportunitySlug } from "@/lib/opportunity-slug";
import { prisma } from "@/lib/prisma";

export type DailyIngestResult = {
  fetched: number;
  upsertedPosts: number;
  llmCalls: number;
  opportunitiesCreated: number;
  skippedIrrelevant: number;
  extractFailures: number;
  errors: string[];
  sources: { reddit: number; productHunt: number; hackerNews: number };
};

function intEnv(name: string, fallback: number): number {
  const v = process.env[name]?.trim();
  if (!v) return fallback;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function hasLlmConfigured(): boolean {
  return Boolean(
    process.env.LLM_API_KEY?.trim() || process.env.DEEPSEEK_API_KEY?.trim(),
  );
}

export async function runDailyIngest(): Promise<DailyIngestResult> {
  const maxPerSource = intEnv("INGEST_MAX_POSTS_PER_SOURCE", 15);
  const maxLlmCalls = intEnv("INGEST_MAX_LLM_CALLS", 25);

  const result: DailyIngestResult = {
    fetched: 0,
    upsertedPosts: 0,
    llmCalls: 0,
    opportunitiesCreated: 0,
    skippedIrrelevant: 0,
    extractFailures: 0,
    errors: [],
    sources: { reddit: 0, productHunt: 0, hackerNews: 0 },
  };

  const [reddit, ph, hn] = await Promise.all([
    fetchRedditPosts(maxPerSource),
    fetchProductHuntPosts(maxPerSource),
    fetchHackerNewsPosts(maxPerSource),
  ]);

  const merged: NormalizedPost[] = [
    ...reddit.slice(0, maxPerSource),
    ...ph.slice(0, maxPerSource),
    ...hn.slice(0, maxPerSource),
  ];
  result.sources.reddit = reddit.length;
  result.sources.productHunt = ph.length;
  result.sources.hackerNews = hn.length;
  result.fetched = merged.length;

  merged.sort((a, b) => b.score - a.score);

  for (const post of merged) {
    try {
      await prisma.sourcePost.upsert({
        where: {
          platform_externalId: {
            platform: post.platform,
            externalId: post.externalId,
          },
        },
        create: {
          platform: post.platform,
          externalId: post.externalId,
          title: post.title.slice(0, 500),
          body: post.body.slice(0, 50_000),
          url: post.url.slice(0, 2000),
          author: post.author,
          score: post.score,
          commentsCount: post.commentsCount,
          createdAt: post.createdAt,
          rawJson: post.rawJson as Prisma.InputJsonValue,
          pipelineStatus: "pending",
        },
        update: {
          title: post.title.slice(0, 500),
          body: post.body.slice(0, 50_000),
          url: post.url.slice(0, 2000),
          author: post.author,
          score: post.score,
          commentsCount: post.commentsCount,
          rawJson: post.rawJson as Prisma.InputJsonValue,
        },
      });
      result.upsertedPosts += 1;
    } catch (e) {
      result.errors.push(
        `upsert ${post.platform}/${post.externalId}: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }

  if (!hasLlmConfigured()) {
    result.errors.push(
      "LLM skipped: set LLM_API_KEY or DEEPSEEK_API_KEY (and optional LLM_BASE_URL / LLM_MODEL).",
    );
    return result;
  }

  let llmBudget = maxLlmCalls;

  const candidates = await prisma.sourcePost.findMany({
    where: {
      opportunity: null,
      pipelineStatus: { in: ["pending", "extract_failed"] },
    },
    orderBy: [{ score: "desc" }, { createdAt: "desc" }],
    take: 80,
  });

  for (const row of candidates) {
    if (llmBudget <= 0) break;

    let passedClassify = false;
    try {
      const classify = await classifyAiProductOpportunity({
        platform: row.platform,
        title: row.title,
        body: row.body,
        url: row.url,
      });
      llmBudget -= 1;
      result.llmCalls += 1;

      if (!classify.relevant) {
        await prisma.sourcePost.update({
          where: { id: row.id },
          data: { pipelineStatus: "skipped_not_ai_product" },
        });
        result.skippedIrrelevant += 1;
        continue;
      }

      passedClassify = true;
      if (llmBudget <= 0) break;

      const extracted = await extractStructuredOpportunity({
        platform: row.platform,
        title: row.title,
        body: row.body,
        url: row.url,
      });
      llmBudget -= 1;
      result.llmCalls += 1;

      const slug = await allocateOpportunitySlug(extracted.title, row.externalId);

      await prisma.$transaction(async (tx) => {
        await tx.opportunity.create({
          data: {
            slug,
            title: extracted.title,
            summary: extracted.summary,
            painPoint: extracted.painPoint,
            targetUser: extracted.targetUser,
            category: extracted.category,
            score: extracted.finalScore,
            buildDifficulty: extracted.buildDifficulty,
            pricingHint: extracted.pricingHint,
            launchChannels: extracted.launchChannels,
            mvpFeatures: extracted.mvpFeatures,
            sourcePlatform: row.platform,
            status: "active",
            sourcePostId: row.id,
            whyNow: extracted.whyNow,
            icp: extracted.icp,
            redditLaunch: extracted.redditLaunch,
            saasPotential: extracted.saasPotential,
            goToMarket: extracted.goToMarket,
            landingHeadline: extracted.landingHeadline,
          },
        });

        await tx.signal.create({
          data: {
            sourcePostId: row.id,
            painScore: extracted.painScore,
            buyIntent: extracted.buyIntent,
            urgency: extracted.urgency,
            aiBuildability: extracted.aiBuildability,
            competition: extracted.competition,
            finalScore: extracted.finalScore,
          },
        });

        await tx.sourcePost.update({
          where: { id: row.id },
          data: { pipelineStatus: "opportunity_created" },
        });
      });

      result.opportunitiesCreated += 1;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      result.errors.push(`post ${row.id}: ${msg}`);
      if (passedClassify) {
        try {
          await prisma.sourcePost.update({
            where: { id: row.id },
            data: { pipelineStatus: "extract_failed" },
          });
          result.extractFailures += 1;
        } catch {
          /* ignore */
        }
      }
    }
  }

  return result;
}
