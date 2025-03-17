// import { NextResponse } from "next/server"
// import Stripe from "stripe"

// // Initialize Stripe with your secret key
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
//   apiVersion: "2025-02-24.acacia",
// })

// export async function POST(request: Request) {
//   try {
//     const body = await request.json()
//     const { cardNumber, expMonth, expYear, cvc } = body

//     // Create a token to validate the card without charging
//     const token = await stripe.tokens.create({
//       card: {
//         number: cardNumber,
//         exp_month: expMonth,
//         exp_year: expYear,
//         cvc: cvc,
//       },
//     })

//     // If we get here without an error, the card is valid
//     return NextResponse.json({
//       success: true,
//       message: "Card is valid",
//       last4: token.card?.last4,
//     })
//   } catch (error) {
//     if (error instanceof Stripe.errors.StripeCardError) {
//       // Card was declined or validation failed
//       return NextResponse.json(
//         {
//           success: false,
//           message: error.message,
//         },
//         { status: 400 },
//       )
//     }

//     // Other errors
//     console.error("Stripe validation error:", error)
//     return NextResponse.json(
//       {
//         success: false,
//         message: "An error occurred while validating the card",
//       },
//       { status: 500 },
//     )
//   }
// }

