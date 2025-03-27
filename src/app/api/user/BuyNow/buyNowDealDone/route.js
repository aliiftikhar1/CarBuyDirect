import prisma from "@/lib/prisma";
import { sendDealDoneNotificationEmail } from "@/lib/sendDoneDealEmail";
import { NextResponse } from "next/server";
import Stripe from "stripe"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
    try {
        const data = await request.json();
        const { price, auctionId, sellerId, replyOf,userId, userType,receiverEmail, userName, vehicleYear, vehicleModel } = data;
       
        const carDetails = {
            vehicleYear, vehicleModel, price
        }
        const sendEmail = await sendDealDoneNotificationEmail(receiverEmail, userName, carDetails)
        if (sendEmail) {
        const resposne = await prisma.notification.create({
            data: {
                senderId: userId,  // Buyer ka ID
                receiverId: sellerId, // Seller ka ID
                auctionId,
                type: userType==="seller"?"seller":"buyer", // Change if needed
                message: "Deal Accepted",
                regarding:"payment-pending",
                replyOf,
                price: parseFloat(price) || null, // Ensure price is Float
            },
        });

        
            return NextResponse.json({
                status: 200,
                success: true,
                message: "Notification sent successfully Via Email",
                resposne,
            });
        }
    
    } catch (error) {
        console.error("Error sending notification:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}