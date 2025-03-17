import prisma from "@/lib/prisma";
import { sendDealDoneNotificationEmailFromByer } from "@/lib/sendDoneDealEmail";
import { NextResponse } from "next/server";
export async function POST(request) {
    try {
        const data = await request.json();
        const { price, auctionId, sellerId, userId, receiverEmail, buyerName, vehicleYear, vehicleModel } = data;
        const carDetails = {
            vehicleYear, vehicleModel, price
        }
        console.log("senderId",userId)
        const sendEmail = await sendDealDoneNotificationEmailFromByer(receiverEmail, buyerName, carDetails)
        const resposne = await prisma.notification.create({
            data: {
                senderId: userId,  // Buyer ka ID
                receiverId: sellerId, // Seller ka ID
                auctionId,
                type: "done", // Change if needed
                message:"done",
                price: parseFloat(price) || null, // Ensure price is Float
            },
        });

        if (sendEmail) {
            return NextResponse.json({
                status: 200,
                success: true,
                message: "Notification sent successfully Via Email",
                resposne,
            });
        }
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