import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
    try {
        const { userId, cardNumber, cardName, cardExpiry, cardCvc, businessType, stripeAccountId } = await req.json();
        console.log("stripeAccountId", stripeAccountId)
        // Step 2: Update User in Database with Stripe Account ID & Other Details
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(userId, 10) },
            data: {
                cardNumber,
                cardName,
                cardExpiry,
                cardCvc,
                businessType,
                stripeAccountId // ✅ Stripe Account ID bhi update ho raha hai
            },
        });
        console.log(updatedUser);
        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
