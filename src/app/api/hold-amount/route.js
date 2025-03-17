import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const { userId } = await req.json();
        // 🛑 STEP 1: User Fetch karo
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) }
        });
        if (!user || !user.stripeCustomerId) {
            return NextResponse.json({ success: false, message: "Your account is under verification. Please try again later or contact support." }, { status: 400 });
        }
        // 🛑 STEP 2: Check karo ke user ne card add kiya hai ya nahi
        if (!user.cardNumber || !user.cardExpiry || !user.cardCvc || !user.cardName) {
            return NextResponse.json({ success: false, message: "No card details found. Please add your card first." }, { status: 400 });
        }
        // 🛑 STEP 3: Stripe Payment Method Create Karna
        const paymentMethod = await stripe.paymentMethods.create({
            type: "card",
            card: {
                number: user.cardNumber,
                exp_month: parseInt(user.cardExpiry.split("/")[0]),
                exp_year: parseInt(user.cardExpiry.split("/")[1]),
                cvc: user.cardCvc
            },
            billing_details: { name: user.cardName }
        });
        // 🛑 STEP 4: Payment Intent Create Karna (Hold $500)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 50000, // $500 in cents
            currency: "usd",
            customer: user.stripeCustomerId,
            payment_method: paymentMethod.id,
            confirm: true,
            capture_method: "manual"
        });

        return NextResponse.json({ success: true, message: "Amount hold successfully", paymentIntentId: paymentIntent.id });
    } catch (error) {
        console.error("Error holding amount:", error);
        return NextResponse.json({ success: false, message: "Failed to hold amount", error: error.message }, { status: 500 });
    }
}
