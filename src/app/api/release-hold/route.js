import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const { paymentIntentId, userId } = await req.json()

    if (!paymentIntentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment intent ID is required",
        },
        { status: 400 },
      )
    }

    // Verify the user exists and has permission to release this hold
    const user = await prisma.user.findUnique({
      where: { id: Number.parseInt(userId) },
    })

    if (!user || !user.stripeCustomerId) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found or not authorized",
        },
        { status: 400 },
      )
    }

    // Retrieve the payment intent to check its status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    // Verify this payment intent belongs to the user's customer
    if (paymentIntent.customer !== user.stripeCustomerId) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to release this hold",
        },
        { status: 403 },
      )
    }

    // Check if the payment intent can be canceled
    // Payment intents can be canceled when they are in one of these statuses:
    // requires_payment_method, requires_capture, requires_confirmation, requires_action, processing
    const cancelableStatuses = [
      "requires_payment_method",
      "requires_capture",
      "requires_confirmation",
      "requires_action",
      "processing",
    ]

    if (!cancelableStatuses.includes(paymentIntent.status)) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot release hold. Payment intent is in ${paymentIntent.status} status.`,
          status: paymentIntent.status,
        },
        { status: 400 },
      )
    }

    // Cancel the payment intent to release the hold
    const canceledPaymentIntent = await stripe.paymentIntents.cancel(paymentIntentId)

    return NextResponse.json({
      success: true,
      message: "Hold released successfully",
      status: canceledPaymentIntent.status,
      paymentIntentId: canceledPaymentIntent.id,
    })
  } catch (error) {
    console.error("Error releasing hold:", error)

    // Handle specific Stripe errors
    if (error.type === "StripeInvalidRequestError") {
      // This happens if the payment intent doesn't exist or has already been canceled
      return NextResponse.json(
        {
          success: false,
          message: "Could not release hold: " + error.message,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to release hold",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

