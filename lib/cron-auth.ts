/** Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}` when CRON_SECRET is set. */
export function isAuthorizedCronRequest(req: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}
