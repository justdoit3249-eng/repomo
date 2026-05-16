export const PLANS = {
  STARTER: {
    name: "Starter",
    price: 2980,
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID,
  },
  PRO: {
    name: "Pro",
    price: 9800,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
  },
  BUSINESS: {
    name: "Business",
    price: 29800,
    stripePriceId: process.env.STRIPE_BUSINESS_PRICE_ID,
  },
} as const;

export type PaidPlan = keyof typeof PLANS;

export function isPaidPlan(value: unknown): value is PaidPlan {
  return typeof value === "string" && value in PLANS;
}
