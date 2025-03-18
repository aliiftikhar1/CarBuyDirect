import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const { cardNumber,customerId, expiryMonth, expiryYear, cvc, name } = await req.json();
        console.log(cardNumber, expiryMonth, expiryYear, cvc, name);
        const token = await stripe.tokens.create({
            card: {
              number: '4242424242424242',
              exp_month: '5',
              exp_year: '2026',
              cvc: '314',
            },
          });
          console.log("TOken is ",token);

        const paymentMethod =  await stripe.customers.createSource(
            'cus_Rx9oCtRwOBJf7r',
            {
              source: 'tok_visa',
            }
          );

        if(paymentMethod){
            const paymentMethodId = paymentMethod.id;
            await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });

        }

        return NextResponse.json({ success: true, paymentMethod });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}