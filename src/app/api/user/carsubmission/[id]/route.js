import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request,{params}){
    const id = params.id
    try {
        const carsubmisions = await prisma.CarSubmission.findMany({
            where:{
                sellerId: parseInt(id)
            },
            include:{
                User: true,
                SubmissionImages: true,
                Brand:true,
            }
        })
        return NextResponse.json({success:true,data:carsubmisions})
        
    } catch (error) {
        return NextResponse.json({success:false,message:"Failed to fetched car submissions"})
    }
}