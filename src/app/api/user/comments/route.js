import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const data = await request.json();
        const { text, auctionId, userId } = data;

        // Validate Required Fields
        if (!text || !auctionId || !userId) {
            return NextResponse.json(
                { success: false, error: "Missing required fields." },
                { status: 400 }
            );
        }

        // Create Comment in Prisma
        const response = await prisma.comment.create({
            data: {
                userId,
                auctionId,
                text,
            },
        });

        return NextResponse.json({
            status: 200,
            success: true,
            message: "Comment added successfully",
            response,
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const auctionId = searchParams.get("auctionId");
        if (!auctionId) {
            return NextResponse.json({ success: false, error: "Auction ID is required" }, { status: 400 });
        }
        const comments = await prisma.comment.findMany({
            where: { auctionId: parseInt(auctionId) },
            include:{
                User:true,
                Auction:true,
                Likes:true
            }
            ,
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json({
            success: true,
            comments
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}