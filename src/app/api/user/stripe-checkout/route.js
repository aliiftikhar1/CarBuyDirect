import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const { userId, amount } = await req.json();

        // Fetch user's Stripe Account ID
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { stripeAccountId: true }
        });

        if (!user || !user.stripeAccountId) {
            return NextResponse.json({ success: false, error: "Seller's Stripe account not found." }, { status: 400 });
        }

        // Calculate Admin's Fee (4.5%) and Seller's Share
        const adminFee = Math.round(amount * 0.045);
        const sellerAmount = amount - adminFee;

        // Create Stripe Checkout session with Payment Split
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Product Payment",
                        },
                        unit_amount: amount, // Total Amount in cents (e.g., 5000 = $50.00)
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            payment_intent_data: {
                application_fee_amount: adminFee, // Admin's Fee (4.5%)
                transfer_data: {
                    destination: user.stripeAccountId, // Seller's Stripe Account
                },
            },
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
        });

        // Store Transaction Record in DB
        await prisma.transaction.create({
            data: {
                userId,
                stripeSessionId: session.id,
                amount: amount / 100, // Convert cents to dollars
                adminFee: adminFee / 100,
                sellerAmount: sellerAmount / 100,
                status: "Pending",
            },
        });

        return NextResponse.json({ success: true, checkoutUrl: session.url });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
