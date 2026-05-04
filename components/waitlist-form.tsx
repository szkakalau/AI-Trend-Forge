"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Request failed");
      }
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
    >
      <Input
        type="email"
        required
        placeholder="you@founder.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-background/60"
      />
      <Button type="submit" disabled={status === "loading"} className="shrink-0">
        {status === "loading" ? "Joining…" : "Join waitlist"}
      </Button>
      {status === "done" ? (
        <p className="text-center text-sm text-muted-foreground sm:text-left">
          You are on the list.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-destructive">Something went wrong.</p>
      ) : null}
    </form>
  );
}
