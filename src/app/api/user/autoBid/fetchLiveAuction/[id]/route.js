import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const auction = await prisma.auction.findMany({
            where: {
                status: "Live",
            },
            include: {
                CarSubmission: {
                    select: {
                        id: true,
                        User: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                Bids: {
                    orderBy: {
                        createdAt: "desc",  
                    },
                },
                Autobid:{
                  where:{
                    status:"active"
                  }
                },
            },
            
        });

        if (auction) {
            return NextResponse.json(
                { status: true, message: "Data fetched successfully", data: auction },
                { status: 200 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch auction" },
            { status: 500 }
        );
    }
}
