import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request){
    try {
        const auctions = await prisma.Auction.findMany({
            include:{
                CarSubmission:{
                    include:{
                        SubmissionImages:true,
                    }
                },
                Seller:{
                    select:{
                        name:true
                    }
                },
                Bids: {
                    orderBy: {
                      createdAt: "desc", 
                    },
                },
                Watching:true
            }
        });

        // Add latestBid field to each auction
        const auctionsWithLatestBid = auctions.map(auction => {
            return {
                ...auction,
                latestBid: auction.Bids.length > 0 ? auction.Bids[0].price : null
            };
        });

        return NextResponse.json({
            success: true, 
            message: "Auctions Fetched Successfully!!", 
            data: auctionsWithLatestBid
        }, {status: 200});
        
    } catch (error) {
        console.error("Error fetching auctions:", error);
        return NextResponse.json({
            success: false, 
            message: "Error occurred while fetching auctions"
        }, {status: 500});
    }
}