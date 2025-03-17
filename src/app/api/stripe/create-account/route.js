// import prisma from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export async function POST(req) {
//     try {
//         const { userId, email, businessType, country } = await req.json();

//         if (!userId || !email || !country) {
//             return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
//         }

//         // Create Stripe Express Account
//         const account = await stripe.accounts.create({
//             type: "express",
//             country: country,
//             email: email,
//             business_type: businessType,
//             capabilities: {
//                 card_payments: { requested: true },
//                 transfers: { requested: true }
//             },
//         });
//         console.log("userId", userId)
//         const updateUser = await prisma.user.update({
//             where: { id: parseInt(userId) },
//             data: { stripeAccountId: account.id }
//         })
//         console.log("updateUser", updateUser)
//         console.log("stripeAccountId", account.id)
//         // Example: await saveStripeAccount(userId, account.id);

//         return NextResponse.json({ success: true, accountId: account.id }, { status: 200 });
//     } catch (error) {
//         console.error("Stripe Error:", error);
//         return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//     }
// }


import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const { userId, email, businessType, country } = await req.json();
        console.log(userId, email, businessType, country)

        if (!userId || !email || !country) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        // Create Stripe Express Account
        const account = await stripe.accounts.create({
            type: "express",
            country: country,
            email: email,
            business_type: businessType,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true }
            },
        });
        
        // console.log("Stripe account created:", account);
        // // Ensure userId is an integer
        // const userIdInt = parseInt(userId);
        // console.log("userId:", userIdInt);
        // console.log("Stripe account ID:", account.id);

        // // Update the user in the database with the Stripe account ID
        // try {
        //     const updateUser = await prisma.user.update({
        //         where: { id: userIdInt }, // Ensure userId is an integer
        //         data: { stripeAccountId: account.id },
        //     });
        //     console.log("User updated:", updateUser);
        // } catch (error) {
        //     console.error("Error updating user:", error);
        //     return NextResponse.json({ success: false, message: "Error updating user" }, { status: 500 });
        // }

        return NextResponse.json({ success: true, accountId: account.id }, { status: 200 });
    } catch (error) {
        console.error("Stripe Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
