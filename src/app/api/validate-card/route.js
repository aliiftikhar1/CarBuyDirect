import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const { cardNumber, routingNumber, name } = await req.json();
        console.log(cardNumber, routingNumber, name);
        const stripe = require('stripe')('sk_test_51R0myHF5CvPkbzucqlkgCwa2mQq64ZWrQVCS6w4UPiqHIkTuywHz808BAcIPDrm7XEyGs8pgsjoVRVDdnszs2I2r00oEfcPmxk');

        const paymentMethod = await stripe.paymentMethods.create({
            type: 'us_bank_account',
            us_bank_account: {
                account_holder_type: 'individual',
                account_number: cardNumber,
                routing_number: '110000000',
            },
            billing_details: {
                name: 'John Doe',
            },
        });

        return NextResponse.json({ success: true, paymentMethod });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
