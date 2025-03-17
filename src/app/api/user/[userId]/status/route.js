import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Make sure Prisma is set up
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function GET(req, { params }) {
    const userId = params.userId; // User ID from URL parameters

    try {
        // Fetch user from the database
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) },  // Adjust based on your database schema
            select: { status: true, stripeAccountId: true },
        });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Fetch Stripe account verification status
        const stripeAccount = await stripe.accounts.retrieve(user.stripeAccountId);

        // Determine the verification status (this could vary based on the country, type, etc.)
        const verificationStatus = stripeAccount.verification ? stripeAccount.verification.status : 'unverified';

        return NextResponse.json({
            success: true,
            userStatus: user.status,
            stripeVerificationStatus: verificationStatus,
        });

    } catch (error) {
        console.error("Error fetching user or Stripe verification status:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch user or Stripe status" }, { status: 500 });
    }
}
