import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const { userId, buyerId, sellerId, productId, productName, price } = await req.json();

        if (!buyerId || !sellerId || !productId || !price) {
            return NextResponse.json({ success: false, message: "Missing required data" }, { status: 400 });
        }

        const adminFee = (price * 4.5) / 100;
        const sellerAmount = price - adminFee;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
            customer: buyerId,
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: { name: productName },
                        unit_amount: price * 100,  
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                buyerId,
                sellerId,
                productId,
                sellerAmount: sellerAmount * 100,  
                adminCommission: adminFee * 100,
            },
        });
        function generateTransactionId() {
            const transactionId = Math.floor(10000000 + Math.random() * 90000000);  
            return `txn_${transactionId}`;
        }
        await prisma.transaction.create({
            data: {
                userId: userId,
                amount: price,
                trancastion_id:generateTransactionId(),  
                order_id: session.id,
                currency: "USD",
                type: "deposit",
                status: "pending",  
            },
        });

        return NextResponse.json({ success: true, url: session.url });
    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json({ success: false, message: "Failed to create checkout session" }, { status: 500 });
    }
}
