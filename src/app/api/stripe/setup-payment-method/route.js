import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

export async function POST(request) {
  try {
    const { paymentMethodId, customerId, email, name } = await request.json()
    console.log("Setting up payment method:", paymentMethodId, customerId, email, name)

    if (!paymentMethodId) {
      return NextResponse.json({ success: false, error: "Payment method ID is required" }, { status: 400 })
    }

    let customer = customerId

    // If no customer ID is provided, create a new customer
    if (!customer && email) {
      const newCustomer = await stripe.customers.create({
        email,
        name,
        payment_method: paymentMethodId,
      })
      customer = newCustomer.id
    }

    if (!customer) {
      return NextResponse.json({ success: false, error: "Customer ID or email is required" }, { status: 400 })
    }

    // Attach the payment method to the customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer,
    })

    // Set as the default payment method
    await stripe.customers.update(customer, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    })

    return NextResponse.json({
      success: true,
      customerId: customer,
      paymentMethodId,
    })
  } catch (error) {
    console.error("Error setting up payment method:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to set up payment method" },
      { status: 500 },
    )
  }
}

