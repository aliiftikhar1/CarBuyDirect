import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId, auctionId, commentId, status } = await request.json();
        if ((!auctionId && !commentId)) {
            return NextResponse.json({ success: false, error: "Provide either auctionId or commentId" }, { status: 400 });
        }
        const existingLike = await prisma.like.findFirst({
            where: {
                userId,
                auctionId: auctionId || null,
                commentId: commentId || null,
            },
        });
        if (existingLike) {
            if (existingLike.status !== status) {
                await prisma.like.update({
                    where: { id: existingLike.id },
                    data: { status },
                });
                return NextResponse.json({ success: true, message: status ? "Liked" : "Disliked", liked: status });
            }
            await prisma.like.delete({ where: { id: existingLike.id } });
            return NextResponse.json({ success: true, message: "Like removed", liked: null });
        }

        await prisma.like.create({
            data: {
                userId,
                auctionId: auctionId || null,
                commentId: commentId || null,
                status,
            },
        });

        return NextResponse.json({ success: true, message: status ? "Liked" : "Disliked", liked: status });
    } catch (error) {
        console.error("Error toggling like:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = parseInt(searchParams.get("userId"));
        const auctionId = searchParams.get("auctionId") ? parseInt(searchParams.get("auctionId")) : null;
        const commentId = searchParams.get("commentId") ? parseInt(searchParams.get("commentId")) : null;
        if (!userId || (!auctionId && !commentId)) {
            return NextResponse.json({ success: false, error: "Invalid parameters" }, { status: 400 });
        }
        const like = await prisma.like.findFirst({
            where: {
                userId,
                auctionId,
                commentId,
            },
        });
        return NextResponse.json({ success: true, liked: like ? like.status : null });
    } catch (error) {
        console.error("Error fetching like status:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
