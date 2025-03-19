import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  let holdedpayment
  try {
    const { paymentIntentId, userId, amount, transferDescription } = await req.json()

    if (!paymentIntentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment intent ID is required",
        },
        { status: 400 },
      )
    }
    if (paymentIntentId) {
      const holdpayment = await prisma.HoldPayments.findUnique({
        include: {
          auction: {
            include: {
              CarSubmission: true
            }
          }
        },
        where: {
          paymentIntentId
        }
      }).catch((err) => {
        console.log("Hold Payment updation failed!")
      })
      if (holdpayment) {
        if (holdpayment.status !== "requires_capture") {
          return NextResponse.json(
            {
              success: false,
              message: "payment has been already initiated",
            },
            { status: 400 },
          )
        }
        holdedpayment=holdpayment

      }
      else {
        return NextResponse.json(
          {
            success: false,
            message: "User hasnot hold a amount for bidding",
          },
          { status: 400 },
        )
      }

    }

    // Verify the user exists and has permission to capture this payment
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

    // Retrieve the payment intent to check its status and available amount
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    // Verify this payment intent belongs to the user's customer
    if (paymentIntent.customer !== user.stripeCustomerId) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to capture this payment",
        },
        { status: 403 },
      )
    }

    // Check if the payment intent can be captured
    if (paymentIntent.status !== "requires_capture") {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot capture payment. Payment intent is in ${paymentIntent.status} status.`,
          status: paymentIntent.status,
        },
        { status: 400 },
      )
    }

    // Get the amount available to capture
    const amountAvailableToCapture = paymentIntent.amount

    // Always create a new transaction first, regardless of amount comparison
    // Get customer's payment methods to ensure we have a valid one
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

    // Get the payment method to use
    let paymentMethodToUse

    // Try to get the customer to see if they have a default payment method
    const customer = await stripe.customers.retrieve(user.stripeCustomerId)

    if (customer && customer.invoice_settings && customer.invoice_settings.default_payment_method) {
      paymentMethodToUse = customer.invoice_settings.default_payment_method
    } else {
      // Use the first available payment method
      paymentMethodToUse = paymentMethods.data[0].id
    }

    try {
      // Step 1: Create a new payment intent for the requested amount
      // Create payment intent options
      const paymentIntentOptions = {
        amount: amount, // Use the entered amount, regardless of comparison
        currency: paymentIntent.currency || "usd",
        customer: user.stripeCustomerId,
        payment_method: paymentMethodToUse,
        confirm: true,
        off_session: true,
        description: `Payment of ${holdedpayment.auction.CarSubmission.vehicleYear} ${holdedpayment.auction.CarSubmission.vehicleMake} ${holdedpayment.auction.CarSubmission.vehicleModel} From ${user.name} has been succeeded!.`,
      }

      // Add statement descriptor suffix if provided
      if (transferDescription) {
        paymentIntentOptions.statement_descriptor_suffix = transferDescription.substring(0, 22)
      }

      console.log("Creating new payment intent with options:", JSON.stringify(paymentIntentOptions))
      const newPaymentIntent = await stripe.paymentIntents.create(paymentIntentOptions)

      // Check if the new payment requires further action
      if (newPaymentIntent.status === "requires_action") {
        return NextResponse.json(
          {
            success: false,
            requiresAction: true,
            clientSecret: newPaymentIntent.client_secret,
            message: "This payment requires additional authentication. Please complete the payment process.",
            newPaymentIntentId: newPaymentIntent.id,
            originalPaymentIntentId: paymentIntentId,
          },
          { status: 200 },
        )
      }

      // Record the new transaction in your database
      await prisma.transaction
        .create({
          data: {
            userId: user.id,
            trancastion_id: newPaymentIntent.id,
            amount: newPaymentIntent.amount,
            status: newPaymentIntent.status,
            type: "new_charge",
            order_id: `New charge before releasing hold. Original: ${paymentIntentId}`,
            // description: `New charge before releasing hold. Original: ${paymentIntentId}`,
            currency: paymentIntent.currency
          },
        })
        .catch((err) => {
          console.log("Failed to record transaction:", err)
        })

      // Step 2: Now that we have successfully created a new payment, cancel the original payment intent
      const cancelOptions = {
        cancellation_reason: "requested_by_customer",
      }

      const canceledPaymentIntent = await stripe.paymentIntents.cancel(paymentIntentId, cancelOptions)

      // Record the cancellation in your database
      // await prisma.transaction
      //   .create({
      //     data: {
      //       userId: user.id,
      //       trancastion_id: canceledPaymentIntent.id,
      //       amount: canceledPaymentIntent.amount,
      //       status: canceledPaymentIntent.status,
      //       type: "hold_released",
      //       order_id: `Hold released after creating new payment: ${newPaymentIntent.id}`,
      //       // description: `Hold released after creating new payment: ${newPaymentIntent.id}`,
      //     },
      //   })
      //   .catch((err) => {
      //     console.log("Failed to record cancellation:", err)
      //   })


      await prisma.HoldPayments.update({
        data: {
          status: "success"
        },
        where: {
          paymentIntentId
        }
      }).catch((err) => {
        console.log("Hold Payment updation failed!")
      })



      return NextResponse.json({
        success: true,
        message: "Created new payment and released previous hold",
        status: newPaymentIntent.status,
        paymentIntentId: newPaymentIntent.id,
        originalPaymentIntentId: paymentIntentId,
        amountCaptured: newPaymentIntent.amount,
        originalAmountReleased: canceledPaymentIntent.amount,
      })
    } catch (chargeError) {
      console.log("Error creating new payment:", chargeError)

      // If there was an error creating the new payment, return the error
      if (chargeError.type === "StripeCardError") {
        return NextResponse.json(
          {
            success: false,
            message: "Card error: " + chargeError.message,
            code: chargeError.code,
            declineCode: chargeError.decline_code,
          },
          { status: 400 },
        )
      }

      return NextResponse.json(
        {
          success: false,
          message: "Failed to create new payment: " + chargeError.message,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.log("Error processing payment:", error)

    // Handle specific Stripe errors
    if (error.type === "StripeInvalidRequestError") {
      return NextResponse.json(
        {
          success: false,
          message: "Could not process payment: " + error.message,
        },
        { status: 400 },
      )
    }

    // Handle card errors
    if (error.type === "StripeCardError") {
      return NextResponse.json(
        {
          success: false,
          message: "Card error: " + error.message,
          code: error.code,
          declineCode: error.decline_code,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process payment",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

