/** Monday 00:00:00.000 UTC for the week containing `d`. */
export function startOfUtcWeek(d = new Date()): Date {
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  const start = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + diff),
  );
  start.setUTCHours(0, 0, 0, 0);
  return start;
}
