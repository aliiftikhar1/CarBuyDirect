import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

export async function POST(request) {
  try {
    const { paymentMethodId, customerId, email, name } = await request.json()

    // If no customer ID is provided, create a new customer
    let customerIdToUse = customerId

    if (!customerIdToUse) {
      const customer = await stripe.customers.create({
        email,
        name,
      })
      customerIdToUse = customer.id
    }

    // Attach the payment method to the customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerIdToUse,
    })

    // Set as the default payment method
    await stripe.customers.update(customerIdToUse, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    })

    // Create a SetupIntent to verify the payment method
    const setupIntent = await stripe.setupIntents.create({
      customer: customerIdToUse,
      payment_method: paymentMethodId,
      confirm: true,
    //   return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payment-complete`,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    })

    return NextResponse.json({
      success: true,
      customerId: customerIdToUse,
      setupIntent: setupIntent.id,
      clientSecret: setupIntent.client_secret,
    })
  } catch (error) {
    console.error("Error setting up payment method:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to set up payment method",
      },
      { status: 400 },
    )
  }
}

