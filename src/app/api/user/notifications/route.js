import prisma from "@/lib/prisma";
import { sendDeclineNotificationEmail } from "@/lib/sendDecniedEmail";

import { NextResponse } from "next/server";
export async function POST(request) {
    try {
        const data = await request.json();
        const { price, message, auctionId, sellerId, userId, receiverEmail, userName, vehicleYear, vehicleModel } = data;
        const carDetails = {
            vehicleYear, vehicleModel, price
        }
        const sendEmail = await sendDeclineNotificationEmail(receiverEmail, userName, carDetails, message)
        const resposne = await prisma.notification.create({
            data: {
                senderId: userId,  // Buyer ka ID
                receiverId: sellerId, // Seller ka ID
                auctionId,
                type: "buyer", // Change if needed
                message,
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

export async function GET() {
    try {
        const notifications = await prisma.notification.findMany({
            include: {
                sender: true,
                receiver: true,
                auction: {
                    include: {
                        CarSubmission: {
                            include:{
                                User: true,
                            }
                        },
                        HoldPayments: true,
                        Bids: {
                            include: {
                                User: true,
                            },
                        },
                    },
                },
            },
            // orderBy: {
            //     createdAt: 'desc', // Ordering by createdAt in descending order
            // },
        });

        return NextResponse.json({
            status: 200,
            success: true,
            message: "Notifications fetched successfully",
            notifications,
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}


export async function PUT(request) {
    try {
        const data = await request.json();
        const { notificationId } = data;
        if (!notificationId) {
            return NextResponse.json({ success: false, error: "Notification ID is required" }, { status: 400 });
        }
        const updatedNotification = await prisma.notification.update({
            where: { id: notificationId },
            data: {
                isRead: true,
            },
        });
        return NextResponse.json({
            status: 200,
            success: true,
            message: "Notification marked as read",
            updatedNotification,
        });
    } catch (error) {
        console.error("Error updating notification:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}