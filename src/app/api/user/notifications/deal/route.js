import prisma from "@/lib/prisma";
import {  sendMakeDealNotificationEmail } from "@/lib/sendMakeDealNotificationEmail";
import { NextResponse } from "next/server";



export async function POST(request) {
    try {
        const data = await request.json();

        const { originalprice, price,replyOf,userType,regarding, message, auctionId, receiverId, senderId, receiverEmail, userName, vehicleYear, vehicleModel } = data;
        const carDetails = {
            vehicleYear, vehicleModel, price
        }
        const response = await sendMakeDealNotificationEmail(receiverEmail, userName, carDetails, message)
        console.log(response)
        // // Notification ko database me save karna
        const resposne = await prisma.notification.create({
            data: {
                originalprice,
                senderId: senderId,  // Buyer ka ID
                receiverId: receiverId, // Seller ka ID
                auctionId,
                type: userType?userType:"seller", // Change if needed
                regarding,
                message,
                price: parseFloat(price) || null, // Ensure price is Float
                replyOf,
                isRead:false
            },
        });
        console.log("RESPONSE FROM NOTIFICTION", resposne)
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