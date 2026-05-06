/** Unified shape after normalizing third-party APIs. */
export type NormalizedPost = {
  platform: "Reddit" | "Product Hunt" | "Hacker News";
  externalId: string;
  title: string;
  body: string;
  url: string;
  author: string | null;
  score: number;
  commentsCount: number;
  createdAt: Date;
  rawJson: Record<string, unknown>;
};
