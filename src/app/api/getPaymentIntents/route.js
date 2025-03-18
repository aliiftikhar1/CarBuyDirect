import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


// POST endpoint that accepts Stripe customerId directly
export async function POST(req) {
  try {
    const { stripeCustomerId, status, limit = 10, startingAfter, endingBefore } = await req.json()

    if (!stripeCustomerId) {
      return NextResponse.json(
        {
          success: false,
          message: "Stripe Customer ID is required",
        },
        { status: 400 },
      )
    }

    // Set up options with filters
    const options = {
      customer: stripeCustomerId,
      limit: Math.min(limit, 100), // Maximum 100 items per request
    }

    // Add status filter if provided
    if (status) {
      options.status = status
    }

    // Add pagination cursors if provided
    if (startingAfter) {
      options.starting_after = startingAfter
    }
    if (endingBefore) {
      options.ending_before = endingBefore
    }

    // Retrieve payment intents from Stripe
    const paymentIntents = await stripe.paymentIntents.list(options)

    // Format the response
    const formattedPaymentIntents = paymentIntents.data.map((intent) => ({
      id: intent.id,
      amount: intent.amount,
      currency: intent.currency,
      status: intent.status,
      created: new Date(intent.created * 1000).toISOString(),
      description: intent.description,
      paymentMethod: intent.payment_method,
      captureMethod: intent.capture_method,
      clientSecret: intent.client_secret,
      // Add any other fields you need
    }))

    return NextResponse.json({
      success: true,
      paymentIntents: formattedPaymentIntents,
      hasMore: paymentIntents.has_more,
      totalCount: paymentIntents.data.length,
    })
  } catch (error) {
    console.error("Error retrieving payment intents:", error)

    // Handle specific Stripe errors
    if (error.type === "StripeInvalidRequestError") {
      return NextResponse.json(
        {
          success: false,
          message: "Could not retrieve payment intents: " + error.message,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve payment intents",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

