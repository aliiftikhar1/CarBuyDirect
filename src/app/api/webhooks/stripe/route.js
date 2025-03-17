import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    const payload = await req.text();
    const sig = req.headers.get("stripe-signature");
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
        console.error("Webhook error:", err.message);
        return NextResponse.json({ success: false, message: "Webhook Error" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const buyerId = parseInt(session.metadata.buyerId);
        const sellerId = parseInt(session.metadata.sellerId);
        const productId = parseInt(session.metadata.productId);
        const sellerAmount = parseInt(session.metadata.sellerAmount) / 100;
        const adminCommission = parseInt(session.metadata.adminCommission) / 100;
        const transactionId = session.payment_intent;
        const orderId = session.id;

        // **Update Transaction in DB**
        await prisma.transaction.updateMany({
            where: { order_id: orderId },
            data: {
                transaction_id: transactionId,
                status: "completed",
            },
        });

        console.log("Transaction completed:", transactionId);
    }

    return NextResponse.json({ success: true });
}
