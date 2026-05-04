"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";

const nav = [
  { href: "/dashboard", label: "Feed" },
  { href: "/favorites", label: "Favorites" },
  { href: "/settings", label: "Settings" },
];

export function PrivateHeader({ plan }: { plan: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight"
          >
            AI Trend Forge
          </Link>
          <nav className="hidden items-center gap-6 sm:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="capitalize">
            {plan}
          </Badge>
          <UserButton />
        </div>
      </div>
    </header>
  );
}
