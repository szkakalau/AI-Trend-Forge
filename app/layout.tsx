import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { DM_Sans, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-family-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-family-heading",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Trend Forge — AI opportunity intelligence",
    template: "%s · AI Trend Forge",
  },
  description:
    "Discover profitable AI product ideas before everyone else. Scanned from Reddit, Product Hunt, and indie communities.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${dmSans.variable} ${fraunces.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <ClerkProvider afterSignOutUrl="/">{children}</ClerkProvider>
        <noscript>
          <div
            style={{
              padding: "1.5rem",
              fontFamily: "system-ui,sans-serif",
              maxWidth: "40rem",
              margin: "2rem auto",
            }}
          >
            <p>此站点需要启用 JavaScript 才能正常显示。</p>
          </div>
        </noscript>
      </body>
    </html>
  );
}
