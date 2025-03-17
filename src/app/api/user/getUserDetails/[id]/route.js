import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request,{params}){
    const id = params.id

    try {
        const user = await prisma.user.findUnique({
            where: {id: parseInt(id)},
            include:{
                Submissions:{
                    include:{
                        SubmissionImages:true
                    }
                },
                Bids:true,
                Auctions:true
            }    
    })
        if (!user) {
           return NextResponse.json({success:true, message:"User not exist"},{status:201})
            }

            return NextResponse.json({success:true, user},{status:200})
            
        
    } catch (error) {
        console.error("Error is", e);
        return NextResponse.json({
            success: false,
            message: "Failed to create user",
            error: e.message,
        }, { status: 500 });
    }
}