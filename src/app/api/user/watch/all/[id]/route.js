import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const data = await request.json();
        console.log("Payload is:", data);

        const auctionId = parseInt(data.auctionId, 10);

        // Validate input
        if (!auctionId || !data.userId) {
            return NextResponse.json(
                { success: false, message: "Invalid input data" },
                { status: 400 }
            );
        }

        // Check if the auction exists
        const auction = await prisma.auction.findUnique({
            where: { id: auctionId },
        });

        if (!auction) {
            return NextResponse.json(
                { success: false, message: "Auction not found" },
                { status: 404 }
            );
        }

        // Check if the user is already watching this auction
        const existingWatch = await prisma.watching.findFirst({
            where: {
                userId: data.userId,
                auctionId: auctionId,
            },
        });

        if (existingWatch) {
            // Remove from watching
            const removedWatch = await prisma.watching.delete({
                where: { id: existingWatch.id },
            });

            return NextResponse.json(
                { success: true, message: "Removed from watching", data: removedWatch },
                { status: 200 }
            );
        }

        // Add to watching
        const newWatch = await prisma.watching.create({
            data: {
                userId: data.userId,
                auctionId: auctionId,
            },
        });

        return NextResponse.json(
            { success: true, message: "Added to watching", data: newWatch },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in POST /watching:", error);

        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const allWatching = await prisma.watching.findMany();

        return NextResponse.json(
            { success: true, data: allWatching },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in GET /watching:", error);

        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
