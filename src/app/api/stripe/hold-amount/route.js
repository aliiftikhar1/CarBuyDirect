import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const { userId, auctionId } = await req.json()
    console.log("userId", userId, "auctionId", auctionId) 

    const user = await prisma.user.findUnique({
      where: { id: Number.parseInt(userId) },
    })

    if (!user || !user.stripeCustomerId) {
      return NextResponse.json(
        {
          success: false,
          message: "Your account is under verification. Please try again later or contact support.",
        },
        { status: 400 },
      )
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: "card",
    })

    if (!paymentMethods.data || paymentMethods.data.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No payment method found. Please add a payment method to your account.",
        },
        { status: 400 },
      )
    }

    let paymentMethodId

    const customer = await stripe.customers.retrieve(user.stripeCustomerId)

    if (customer && customer.invoice_settings && customer.invoice_settings.default_payment_method) {
      paymentMethodId = customer.invoice_settings.default_payment_method
    } else {

      paymentMethodId = paymentMethods.data[0].id
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 50000, // $500 in cents
      currency: "usd",
      customer: user.stripeCustomerId,
      payment_method: paymentMethodId,
      confirm: true,
      capture_method: "manual",
      off_session: true,
    })

    if (paymentIntent.status === "requires_action") {
      return NextResponse.json(
        {
          success: false,
          requiresAction: true,
          clientSecret: paymentIntent.client_secret,
          message: "This payment requires additional authentication. Please complete the payment process.",
        },
        { status: 200 },
      )
    }

    await prisma.HoldPayments.create({
      data: {
        userId: user.id,
        auctionId,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
      },
    })


    return NextResponse.json({
      success: true,
      message: "Amount hold successfully",
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
    })
  } catch (error) {
    console.error("Error holding amount:", error)


    if (error.type === "StripeCardError") {
      return NextResponse.json(
        {
          success: false,
          message: "Payment failed: " + error.message,
          code: error.code,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to hold amount",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

