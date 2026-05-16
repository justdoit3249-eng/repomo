type Plan = "FREE" | "STARTER" | "PRO" | "BUSINESS";

const PLAN_LIMITS: Record<Plan, number> = {
  FREE: 3,
  STARTER: 30,
  PRO: 9999,
  BUSINESS: 9999,
};

export function getUsageLimit(plan: Plan): number {
  return PLAN_LIMITS[plan];
}

export function canGenerate(plan: Plan, currentUsage: number): boolean {
  return currentUsage < PLAN_LIMITS[plan];
}

export function getRemainingUsage(plan: Plan, currentUsage: number): number {
  return Math.max(0, PLAN_LIMITS[plan] - currentUsage);
}
