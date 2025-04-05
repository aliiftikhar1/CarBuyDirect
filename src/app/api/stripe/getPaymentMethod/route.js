// import { NextResponse } from "next/server"
// import Stripe from "stripe"

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
//   apiVersion: "2023-10-16",
// })

// export async function GET(request) {
//   try {
//     // const { searchParams } = new URL(request.url)
//     const customerId = "customerId"
//     // searchParams.get("customerId")

//     if (!customerId) {
//       return NextResponse.json({ error: "Customer ID is required" }, { status: 400 })
//     }

//     const paymentMethods = await stripe.paymentMethods.list({
//       customer: customerId,
//       type: "card",
//     })

//     return NextResponse.json({ paymentMethods: paymentMethods.data })
//   } catch (error) {
//     console.error("Error fetching payment methods:", error)
//     return NextResponse.json({ error: "Failed to fetch payment methods" }, { status: 500 })
//   }
// }

