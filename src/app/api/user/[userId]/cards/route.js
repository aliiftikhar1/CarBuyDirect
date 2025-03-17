import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function GET(req, { params }) {
    const userId = params.userId; // User ID from URL parameters

    try {
        // Fetch the user's Stripe customer ID from the database (assuming it's stored)
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) },  // Adjust based on your database schema
            select: { stripeAccountId: true },
        });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Fetch the user's card details from Stripe
        const paymentMethods = await stripe.paymentMethods.list({
            customer: user.stripeAccountId,
            type: 'card',
        });

        if (paymentMethods.data.length === 0) {
            return NextResponse.json({ success: false, message: "No card found for user" }, { status: 404 });
        }

        // Extract the first card's details
        const card = paymentMethods.data[0];
        const cardDetails = {
            brand: card.card.brand,
            last4: card.card.last4,
            exp_month: card.card.exp_month,
            exp_year: card.card.exp_year,
        };

        return NextResponse.json({
            success: true,
            cardDetails: cardDetails,
        });

    } catch (error) {
        console.error("Error fetching Stripe card details:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch card details" }, { status: 500 });
    }
}
