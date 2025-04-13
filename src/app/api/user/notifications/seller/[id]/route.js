import prisma from "@/lib/prisma";

import { NextResponse } from "next/server";
export async function GET(request,{params}) {
    const id = params.id
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
            where:{
                receiverId:parseInt(id)
            }
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