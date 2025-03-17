import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    const payload = await req.text();
    const sig = req.headers.get("stripe-signature");

    try {
        const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);

        if (event.type === "account.updated") {
            const account = event.data.object;
            console.log("Account updated:", account);

            // Update your database with the new Stripe account status (if needed)
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
