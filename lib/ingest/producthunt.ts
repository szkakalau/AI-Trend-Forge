import type { NormalizedPost } from "@/lib/ingest/types";

const POSTS_QUERY = `
  query PostsForPipeline($first: Int!) {
    posts(first: $first) {
      edges {
        node {
          id
          name
          tagline
          url
          votesCount
          commentsCount
          createdAt
        }
      }
    }
  }
`;

type PhResponse = {
  data?: {
    posts?: {
      edges?: Array<{
        node?: {
          id?: string;
          name?: string;
          tagline?: string;
          url?: string;
          votesCount?: number;
          commentsCount?: number;
          createdAt?: string;
        };
      }>;
    };
  };
  errors?: Array<{ message?: string }>;
};

export async function fetchProductHuntPosts(limit: number): Promise<NormalizedPost[]> {
  const token = process.env.PRODUCT_HUNT_DEVELOPER_TOKEN?.trim();
  if (!token) return [];

  const res = await fetch("https://api.producthunt.com/v2/api/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: POSTS_QUERY,
      variables: { first: Math.min(limit, 50) },
    }),
  });

  if (!res.ok) {
    console.error("Product Hunt GraphQL HTTP error", res.status, await res.text());
    return [];
  }

  const json = (await res.json()) as PhResponse;
  if (json.errors?.length) {
    console.error("Product Hunt GraphQL errors", json.errors);
    return [];
  }

  const edges = json.data?.posts?.edges ?? [];
  const out: NormalizedPost[] = [];

  for (const edge of edges) {
    const n = edge.node;
    if (!n?.id || !n.name) continue;
    const tagline = n.tagline?.trim() ?? "";
    const body = tagline;

    out.push({
      platform: "Product Hunt",
      externalId: n.id,
      title: n.name,
      body,
      url: n.url ?? `https://www.producthunt.com/posts/${encodeURIComponent(n.name)}`,
      author: null,
      score: typeof n.votesCount === "number" ? n.votesCount : 0,
      commentsCount:
        typeof n.commentsCount === "number" ? n.commentsCount : 0,
      createdAt: n.createdAt ? new Date(n.createdAt) : new Date(),
      rawJson: n as Record<string, unknown>,
    });
  }

  return out;
}
