import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const id = params.id;
    console.log("Slug is:", id);

    try {
        const response = await prisma.Auction.findFirst({ 
            where: {
                CarSubmission: {
                    webSlug: id  
                }
            },
            include: {
                CarSubmission: {
                    include: {
                        SubmissionImages: true,
                        Brand: true,
                    }
                },
                Seller: {
                    select: {
                        name: true,
                        type: true
                    }
                },
                Bids: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    include: {
                        User: true
                    }
                },
            }
        });

        if (!response) {
            return NextResponse.json({ success: false, message: "Auction not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Auctions Fetched Successfully!!", data: response }, { status: 200 });

    } catch (error) {
        console.error("Error fetching auctions:", error);
        return NextResponse.json({ success: false, message: "Error occurred while fetching auctions" }, { status: 500 });
    }
}
