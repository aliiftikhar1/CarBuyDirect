import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request){
    try {
        const response = await prisma.Auction.findMany({
            where:{
                featured:true,
            },
            include:{
                CarSubmission:{
                    include:{
                        SubmissionImages:true,
                        Brand:true
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
        })
        return NextResponse.json({success:true, message:"Auctions Fetched Successfully!!",data:response},{status:200})
        
    } catch (error) {
        return NextResponse.json({success:false, message:"Error occur while fetching auctions"},{status:500})
    }
}