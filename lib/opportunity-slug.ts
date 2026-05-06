import { prisma } from "@/lib/prisma";

export function slugifyTitle(title: string): string {
  const s = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  return s.length > 0 ? s : "opportunity";
}

export async function allocateOpportunitySlug(baseTitle: string, salt: string): Promise<string> {
  const base = `${slugifyTitle(baseTitle)}-${salt.replace(/[^a-z0-9]/gi, "").slice(0, 16)}`;
  let slug = base.slice(0, 120);
  let n = 0;
  while (true) {
    const clash = await prisma.opportunity.findUnique({ where: { slug } });
    if (!clash) return slug;
    n += 1;
    slug = `${base}-${n}`.slice(0, 128);
    if (n > 80) throw new Error("Could not allocate unique slug");
  }
}
