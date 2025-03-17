// // // import { NextResponse } from "next/server";
// // // import Stripe from "stripe";
// // // import prisma from "@/lib/prisma";  
// // // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // // export async function POST(req) {
// // //     try {
// // //         const { userId, fullName, email, businessType, country, phoneNumber } = await req.json();

// // //         const account = await stripe.accounts.create({
// // //             type: "express",
// // //             country,
// // //             email,
// // //             business_type: businessType,
// // //             capabilities: {
// // //                 card_payments: { requested: true },
// // //                 transfers: { requested: true },
// // //             },
// // //             business_profile: {
// // //                 name: fullName,
// // //                 support_email: email,
// // //                 support_phone: phoneNumber,
// // //             },
// // //         });

// // //         // Step 2: Update User in Database with Stripe Account ID
// // //         await prisma.user.update({
// // //             where: { id: userId },
// // //             data: {
// // //                 stripeAccountId: account.id,
// // //                 stripeStatus: "pending", // Default "pending"
// // //             },
// // //         });

// // //         // Step 3: Create Onboarding Link
// // //         const accountLink = await stripe.accountLinks.create({
// // //             account: account.id,
// // //             refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
// // //             return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
// // //             type: "account_onboarding",
// // //         });

// // //         return NextResponse.json({ success: true, account, accountLink });
// // //     } catch (error) {
// // //         return NextResponse.json({ success: false, error: error.message }, { status: 500 });
// // //     }
// // // }


// // import Stripe from "stripe";
// // import prisma from "@/lib/prisma"; // Prisma client

// // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// // const ADMIN_STRIPE_ACCOUNT_ID = process.env.STRIPE_ADMIN_ACCOUNT_ID;

// // export default async function handler(req, res) {
// //   if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

// //   try {
// //     const { userId, sellerId, amount, productName } = req.body;

// //     // Fetch seller's Stripe account ID from database
// //     const seller = await prisma.user.findUnique({
// //       where: { id: sellerId },
// //       select: { stripeAccountId: true }
// //     });

// //     if (!seller || !seller.stripeAccountId) {
// //       return res.status(400).json({ error: "Seller Stripe account not connected." });
// //     }

// //     // Calculate split payment
// //     const adminFee = Math.round(amount * 0.045); // 4.5% admin fee
// //     const sellerAmount = amount - adminFee;

// //     // Create Stripe Checkout Session
// //     const session = await stripe.checkout.sessions.create({
// //       payment_method_types: ["card"],
// //       mode: "payment",
// //       success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
// //       cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
// //       customer_email: "buyer@example.com", // Optional
// //       line_items: [
// //         {
// //           price_data: {
// //             currency: "usd",
// //             product_data: { name: productName },
// //             unit_amount: amount,
// //           },
// //           quantity: 1,
// //         },
// //       ],
// //       metadata: { userId, sellerId, adminFee, sellerAmount },
// //       payment_intent_data: {
// //         application_fee_amount: adminFee,
// //         transfer_data: {
// //           destination: seller.stripeAccountId // Seller's Stripe Account
// //         }
// //       }
// //     });

// //     res.status(200).json({ sessionId: session.id });

// //   } catch (error) {
// //     console.error("Stripe Checkout Error:", error);
// //     res.status(500).json({ error: "Something went wrong" });
// //   }
// // }


// import Stripe from "stripe";
// import prisma from "@/lib/prisma";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// const ADMIN_STRIPE_ACCOUNT_ID = process.env.STRIPE_ADMIN_ACCOUNT_ID;

// export async function POST(req) {
//   try {
//     const { userId, sellerId, amount, productName } = await req.json();

//     // Fetch seller's Stripe account ID
//     const seller = await prisma.user.findUnique({
//       where: { id: sellerId },
//       select: { stripeAccountId: true }
//     });

//     if (!seller || !seller.stripeAccountId) {
//       return new Response(JSON.stringify({ error: "Seller Stripe account not connected." }), { status: 400 });
//     }

//     // Calculate split payment
//     const adminFee = Math.round(amount * 0.045); // 4.5% admin fee
//     const sellerAmount = amount - adminFee;

//     // Create Stripe Checkout Session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
//       customer_email: "buyer@example.com", // Optional
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: { name: productName },
//             unit_amount: amount,
//           },
//           quantity: 1,
//         },
//       ],
//       metadata: { userId, sellerId, adminFee, sellerAmount },
//       payment_intent_data: {
//         application_fee_amount: adminFee,
//         transfer_data: {
//           destination: seller.stripeAccountId // Seller's Stripe Account
//         }
//       }
//     });

//     return new Response(JSON.stringify({ sessionId: session.id }), { status: 200 });

//   } catch (error) {
//     console.error("Stripe Checkout Error:", error);
//     return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
//   }
// }


export async function POST(req) {
  try {
    const { userId, sellerId, amount, productName } = await req.json();
    console.log("Received Data:", { userId, sellerId, amount, productName });

    if (!userId || !sellerId || !amount || !productName) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Fetch seller's Stripe account
    const seller = await prisma.user.findUnique({
      where: { id: sellerId },
      select: { stripeAccountId: true }
    });
    console.log("Seller Data:", seller);

    if (!seller || !seller.stripeAccountId) {
      return new Response(JSON.stringify({ error: "Seller Stripe account not connected" }), { status: 400 });
    }

    const adminFee = Math.round(amount * 0.045);
    const sellerAmount = amount - adminFee;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      customer_email: "buyer@example.com",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: productName },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      metadata: { userId, sellerId, adminFee, sellerAmount },
      payment_intent_data: {
        application_fee_amount: adminFee,
        transfer_data: {
          destination: seller.stripeAccountId
        }
      }
    });

    return new Response(JSON.stringify({ sessionId: session.id }), { status: 200 });

  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
