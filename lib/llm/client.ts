export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function chatCompletionJson(messages: ChatMessage[]): Promise<string> {
  const base = (process.env.LLM_BASE_URL ?? "https://api.deepseek.com").replace(/\/$/, "");
  const key =
    process.env.LLM_API_KEY?.trim() ?? process.env.DEEPSEEK_API_KEY?.trim() ?? "";
  const model = process.env.LLM_MODEL?.trim() ?? "deepseek-chat";

  if (!key) {
    throw new Error("Set LLM_API_KEY or DEEPSEEK_API_KEY for the ingest pipeline.");
  }

  const body: Record<string, unknown> = {
    model,
    messages,
    temperature: 0.25,
    response_format: { type: "json_object" },
  };

  const res = await fetch(`${base}/v1/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LLM HTTP ${res.status}: ${text.slice(0, 500)}`);
  }

  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = json.choices?.[0]?.message?.content;
  if (!content?.trim()) {
    throw new Error("LLM returned empty content");
  }
  return content.trim();
}
