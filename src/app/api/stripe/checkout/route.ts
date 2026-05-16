import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isPaidPlan, PLANS } from "@/lib/plans";
import { assertStripeConfigured, stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  try {
    assertStripeConfigured();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stripe設定エラー";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const body = (await request.json().catch(() => ({}))) as { plan?: unknown };

  if (!isPaidPlan(body.plan)) {
    return NextResponse.json({ error: "無効なプランです" }, { status: 400 });
  }

  const selectedPlan = PLANS[body.plan];

  if (!selectedPlan.stripePriceId) {
    return NextResponse.json(
      { error: `${body.plan}のStripe Price IDが未設定です` },
      { status: 500 }
    );
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: session.user.email,
    line_items: [{ price: selectedPlan.stripePriceId, quantity: 1 }],
    metadata: { plan: body.plan },
    subscription_data: { metadata: { plan: body.plan } },
    success_url: `${origin}/dashboard?success=true`,
    cancel_url: `${origin}/pricing`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
