import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request){
    try {
        const transactions = await prisma.Transaction.findMany({
            include:{
                user:true
            }
        })
        return NextResponse.json({success:true,data:transactions})
        
    } catch (error) {
        return NextResponse.json({success:false,message:"Failed to fetched car submissions"})
    }
}