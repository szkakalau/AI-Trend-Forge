import { auth, currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function rethrowDbHelp(original: unknown): never {
  const msg = original instanceof Error ? original.message : String(original);
  if (
    original instanceof Prisma.PrismaClientInitializationError ||
    /DATABASE_URL|P1001|P1017|Can't reach database server|User was denied access/i.test(
      msg,
    )
  ) {
    throw new Error(
      "数据库不可用：请在项目根目录 .env 中填写真实的 DATABASE_URL（不要使用示例里的 USER/PASSWORD 占位符），然后执行 npm run db:push，再重启 npm run dev。",
    );
  }
  throw original;
}

export async function syncUserFromClerk() {
  const { userId } = await auth();
  if (!userId) return null;

  const cu = await currentUser();
  const email =
    cu?.primaryEmailAddress?.emailAddress ??
    cu?.emailAddresses?.[0]?.emailAddress ??
    null;
  const name =
    cu?.fullName ??
    cu?.username ??
    cu?.firstName ??
    null;

  try {
    return await prisma.user.upsert({
      where: { clerkUserId: userId },
      create: {
        clerkUserId: userId,
        email: email ?? undefined,
        name: name ?? undefined,
      },
      update: {
        email: email ?? undefined,
        name: name ?? undefined,
      },
    });
  } catch (e) {
    rethrowDbHelp(e);
  }
}
