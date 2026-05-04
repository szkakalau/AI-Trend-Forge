import { DatabaseNotConfigured } from "@/components/database-not-configured";
import { PrivateHeader } from "@/components/private-header";
import { isDatabaseUrlUnsetOrPlaceholder } from "@/lib/database-env";
import { syncUserFromClerk } from "@/lib/sync-user";

export const dynamic = "force-dynamic";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isDatabaseUrlUnsetOrPlaceholder()) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <PrivateHeader plan="free" />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
          <DatabaseNotConfigured />
        </main>
      </div>
    );
  }

  const user = await syncUserFromClerk();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PrivateHeader plan={user?.plan ?? "free"} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">{children}</main>
    </div>
  );
}
