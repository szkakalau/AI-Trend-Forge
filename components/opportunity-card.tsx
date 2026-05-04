"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type OpportunityCardData = {
  id: string;
  slug: string;
  title: string;
  score: number;
  category: string;
  pricingHint: string;
  buildDifficulty: string;
  sourcePlatform: string;
  summary: string;
};

export function OpportunityCard({
  opp,
  favorited,
  favoritesEnabled,
}: {
  opp: OpportunityCardData;
  favorited: boolean;
  favoritesEnabled: boolean;
}) {
  async function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!favoritesEnabled) return;
    await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunityId: opp.id }),
    });
    window.location.reload();
  }

  return (
    <Card className="group relative overflow-hidden border-border/80 transition-shadow hover:shadow-lg hover:shadow-black/20">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2">
        <div className="space-y-1">
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
            {opp.sourcePlatform}
          </Badge>
          <CardTitle className="font-[family-name:var(--font-heading)] text-xl leading-snug">
            <Link
              href={`/opportunity/${opp.slug}`}
              className="after:absolute after:inset-0 after:content-['']"
            >
              {opp.title}
            </Link>
          </CardTitle>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <Badge className="bg-primary text-primary-foreground">
            Pain {opp.score}
          </Badge>
          {favoritesEnabled ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="relative z-10 size-9"
              aria-label={favorited ? "Remove favorite" : "Add favorite"}
              onClick={toggleFavorite}
            >
              <Heart
                className={cn(
                  "size-5",
                  favorited ? "fill-primary text-primary" : "text-muted-foreground",
                )}
              />
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pb-2">
        <p className="line-clamp-3 text-sm text-muted-foreground">{opp.summary}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{opp.category}</Badge>
          <Badge variant="secondary">{opp.buildDifficulty}</Badge>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Monetization hint: {opp.pricingHint}
      </CardFooter>
    </Card>
  );
}
