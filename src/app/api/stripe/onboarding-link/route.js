import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const { accountId } = await req.json();

        if (!accountId) {
            return NextResponse.json({ success: false, message: "Missing account ID" }, { status: 400 });
        }
        // https://487c-202-70-150-235.ngrok-free.app
        const accountLink = await stripe.accountLinks.create({
            account: accountId,
            // refresh_url: process.env.NEXT_PUBLIC_APP_URL + "/dashboard",
            // return_url: process.env.NEXT_PUBLIC_APP_URL + "/dashboard",
            refresh_url: 'https://487c-202-70-150-235.ngrok-free.app/onboarding-retry',
            return_url: 'https://487c-202-70-150-235.ngrok-free.app/Seller/Pages/Payment',
            type: "account_onboarding",
        });

        return NextResponse.json({ success: true, url: accountLink.url }, { status: 200 });
    } catch (error) {
        console.error("Stripe Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
