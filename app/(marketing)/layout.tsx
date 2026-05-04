import { MarketingHeader } from "@/components/marketing-header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <div className="flex-1">{children}</div>
      <footer className="border-t border-border/60 py-10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AI Trend Forge. Built for founders shipping fast.
      </footer>
    </div>
  );
}
