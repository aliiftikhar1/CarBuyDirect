"use server"

import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function validateCardToken(token) {
  try {
    // Verify the payment method exists and is valid
    const paymentMethod = await stripe.paymentMethods.retrieve(token)

    return {
      success: true,
      last4: paymentMethod.card?.last4,
      expMonth: paymentMethod.card?.exp_month,
      expYear: paymentMethod.card?.exp_year,
      brand: paymentMethod.card?.brand,
    }
  } catch (error) {
    console.error("Error validating card:", error)
    return {
      success: false,
      error: "Invalid card details",
    }
  }
}

