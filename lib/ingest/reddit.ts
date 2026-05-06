import type { NormalizedPost } from "@/lib/ingest/types";

type RedditListingChild = {
  data?: {
    name?: string;
    title?: string;
    selftext?: string;
    url?: string;
    permalink?: string;
    score?: number;
    num_comments?: number;
    created_utc?: number;
    author?: string;
    stickied?: boolean;
    is_self?: boolean;
  };
};

type RedditListingResponse = {
  data?: {
    children?: RedditListingChild[];
  };
};

let tokenCache: { accessToken: string; expiresAtMs: number } | null = null;

async function redditAccessToken(): Promise<string | null> {
  const clientId = process.env.REDDIT_CLIENT_ID?.trim();
  const clientSecret = process.env.REDDIT_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return null;

  const now = Date.now();
  if (tokenCache && tokenCache.expiresAtMs > now + 10_000) {
    return tokenCache.accessToken;
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const userAgent =
    process.env.REDDIT_USER_AGENT?.trim() ??
    "web:ai-trend-forge:v1.0 (by /u/ai-trend-forge; contact: dev@localhost)";

  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": userAgent,
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  if (!res.ok) {
    console.error("Reddit OAuth failed", res.status, await res.text());
    return null;
  }

  const json = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
  };
  if (!json.access_token) return null;

  const ttlMs = (json.expires_in ?? 3600) * 1000;
  tokenCache = { accessToken: json.access_token, expiresAtMs: now + ttlMs };
  return json.access_token;
}

function parseSubreddits(): string[] {
  const raw =
    process.env.REDDIT_SUBREDDITS?.trim() ??
    "SideProject,SaaS,Entrepreneur,machinelearning,artificial";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function fetchRedditPosts(maxTotal: number): Promise<NormalizedPost[]> {
  const token = await redditAccessToken();
  if (!token) return [];

  const subs = parseSubreddits();
  const limitPerSub = Math.max(5, Math.ceil(maxTotal / Math.max(subs.length, 1)));

  const userAgent =
    process.env.REDDIT_USER_AGENT?.trim() ??
    "web:ai-trend-forge:v1.0 (by /u/ai-trend-forge; contact: dev@localhost)";

  const out: NormalizedPost[] = [];
  const seen = new Set<string>();

  for (const sub of subs) {
    if (out.length >= maxTotal) break;
    const url = `https://oauth.reddit.com/r/${encodeURIComponent(sub)}/hot?limit=${limitPerSub}&raw_json=1`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": userAgent,
      },
    });
    if (!res.ok) {
      console.error(`Reddit listing failed r/${sub}`, res.status);
      continue;
    }
    const json = (await res.json()) as RedditListingResponse;
    const children = json.data?.children ?? [];
    for (const child of children) {
      const d = child.data;
      if (!d?.name || !d.title) continue;
      if (d.stickied) continue;

      const externalId = d.name;
      const key = `Reddit:${externalId}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const permalink = d.permalink
        ? `https://www.reddit.com${d.permalink}`
        : "";
      const link = d.url?.startsWith("/r/") ? `https://www.reddit.com${d.url}` : d.url;
      const urlFull =
        d.is_self === false && link && !link.includes("reddit.com")
          ? link
          : permalink || link || "";

      const body =
        (d.selftext && d.selftext.trim()) ||
        (urlFull && urlFull !== permalink ? `Link: ${urlFull}` : "");

      out.push({
        platform: "Reddit",
        externalId,
        title: d.title,
        body,
        url: permalink || urlFull || `https://reddit.com`,
        author: d.author ?? null,
        score: typeof d.score === "number" ? d.score : 0,
        commentsCount: typeof d.num_comments === "number" ? d.num_comments : 0,
        createdAt: new Date((d.created_utc ?? 0) * 1000),
        rawJson: { subreddit: sub, ...d } as Record<string, unknown>,
      });
      if (out.length >= maxTotal) return out;
    }
  }

  return out;
}
