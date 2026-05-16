import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { isPaidPlan } from "@/lib/plans";
import { assertStripeConfigured, stripe } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    assertStripeConfigured();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stripe設定エラー";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Webhook署名またはシークレットが不足しています" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "無効なWebhook";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = createServerSupabase();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const plan = session.metadata?.plan;
    const customerEmail = session.customer_details?.email;
    const customerId = typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;
    const subscriptionId = typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

    if (plan && isPaidPlan(plan) && customerEmail) {
      await supabase
        .from("User")
        .update({
          plan,
          stripeCustomerId: customerId ?? null,
          stripeSubscriptionId: subscriptionId ?? null,
        })
        .eq("email", customerEmail);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;

    await supabase
      .from("User")
      .update({
        plan: "FREE",
        stripeSubscriptionId: null,
      })
      .eq("stripeCustomerId", customerId);
  }

  return NextResponse.json({ received: true });
}
