/**
 * Detects missing DATABASE_URL or the template value shipped in `.env.example`,
 * which cannot connect and causes 500s on every DB-backed route.
 */
export function isDatabaseUrlUnsetOrPlaceholder(): boolean {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) return true;
  if (raw.includes("USER:PASSWORD@HOST")) return true;
  return false;
}
