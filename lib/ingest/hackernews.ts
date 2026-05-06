import type { NormalizedPost } from "@/lib/ingest/types";

type HnHit = {
  objectID?: string;
  title?: string;
  url?: string;
  story_text?: string;
  points?: number;
  num_comments?: number;
  created_at_i?: number;
  author?: string;
};

type HnSearchResponse = {
  hits?: HnHit[];
};

function parseQueries(): string[] {
  const raw =
    process.env.HN_SEARCH_QUERIES?.trim() ??
    "ai startup,llm product,saas indie,hacker news ai";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function fetchHackerNewsPosts(limitPerQuery: number): Promise<NormalizedPost[]> {
  const out: NormalizedPost[] = [];
  const seen = new Set<string>();

  for (const q of parseQueries()) {
    const url = new URL("https://hn.algolia.com/api/v1/search");
    url.searchParams.set("query", q);
    url.searchParams.set("tags", "story");
    url.searchParams.set("hitsPerPage", String(Math.min(limitPerQuery, 30)));

    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) {
      console.error("HN Algolia error", q, res.status);
      continue;
    }
    const json = (await res.json()) as HnSearchResponse;
    for (const hit of json.hits ?? []) {
      if (!hit.objectID || !hit.title) continue;
      const key = `HN:${hit.objectID}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const storyUrl = hit.url?.trim() || "";
      const hnDiscuss = `https://news.ycombinator.com/item?id=${hit.objectID}`;
      const body =
        (hit.story_text?.trim() ||
          (storyUrl ? `Link: ${storyUrl}` : "")) ?? "";

      out.push({
        platform: "Hacker News",
        externalId: hit.objectID,
        title: hit.title,
        body,
        url: storyUrl || hnDiscuss,
        author: hit.author ?? null,
        score: typeof hit.points === "number" ? hit.points : 0,
        commentsCount:
          typeof hit.num_comments === "number" ? hit.num_comments : 0,
        createdAt: new Date((hit.created_at_i ?? 0) * 1000),
        rawJson: hit as Record<string, unknown>,
      });
    }
  }

  return out;
}
