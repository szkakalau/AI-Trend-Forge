"use client";

import Link from "next/link";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MarketingHeader() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight"
        >
          AI Trend Forge
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/pricing"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          {!isLoaded ? (
            <span className="h-8 w-28 animate-pulse rounded-md bg-muted" aria-hidden />
          ) : isSignedIn ? (
            <Link
              href="/dashboard"
              className={buttonVariants({ size: "sm", variant: "secondary" })}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button size="sm" variant="ghost">
                  Sign in
                </Button>
              </SignInButton>
              <Link href="/sign-up" className={buttonVariants({ size: "sm" })}>
                Get started
              </Link>
            </>
          )}
        </nav>

        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
              )}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col gap-6">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4">
                <Link href="/pricing" className="text-sm font-medium">
                  Pricing
                </Link>
                {!isLoaded ? null : isSignedIn ? (
                  <Link
                    href="/dashboard"
                    className={buttonVariants({ className: "w-full" })}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <Button variant="secondary" className="w-full">
                        Sign in
                      </Button>
                    </SignInButton>
                    <Link
                      href="/sign-up"
                      className={buttonVariants({ className: "w-full" })}
                    >
                      Get started
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
