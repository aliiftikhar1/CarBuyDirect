import prisma from "@/lib/prisma";
import { sendDealDoneNotificationEmail } from "@/lib/sendDoneDealEmail";
import { NextResponse } from "next/server";
export async function POST(request) {
    try {
        const data = await request.json();
        const { price, auctionId,replyOf,userType, sellerId, userId, receiverEmail, userName, vehicleYear, vehicleModel } = data;
        const carDetails = {
            vehicleYear, vehicleModel, price
        }
        // const sendEmail = await sendDealDoneNotificationEmail(receiverEmail, userName, carDetails)
        const resposne = await prisma.notification.create({
            data: {
                senderId: userId,  // Buyer ka ID
                receiverId: sellerId, // Seller ka ID
                auctionId,
                type: userType, // Change if needed
                message: "decline",
                replyOf,
                price: parseFloat(price) || null, // Ensure price is Float
            },
        });

        // if (sendEmail) {
            return NextResponse.json({
                status: 200,
                success: true,
                message: "Notification sent successfully Via Email",
                resposne,
            });
        // }
        return NextResponse.json({
            status: 200,
            success: true,
            message: "Notification sent successfully",
            resposne,
        });
    } catch (error) {
        console.error("Error sending notification:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}