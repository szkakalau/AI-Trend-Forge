export const PLANS = {
  FREE: "free",
  PRO: "pro",
  FOUNDER: "founder",
} as const;

/** Max distinct opportunity detail unlocks per UTC week for free users. */
export const FREE_WEEKLY_DETAIL_UNLOCKS = 3;

export function isPaidPlan(plan: string): boolean {
  return plan === PLANS.PRO || plan === PLANS.FOUNDER;
}

export function canUseFavorites(plan: string): boolean {
  return isPaidPlan(plan);
}
