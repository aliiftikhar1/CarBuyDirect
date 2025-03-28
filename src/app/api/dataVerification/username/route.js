import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const data = await request.json();
        console.log("Payload is", data);

        const checkUser = await prisma.User.findMany({
            where:{
                username: data.username
            }
        }) 
        
        if(checkUser.length>0){
            return NextResponse.json({
                success: true,
                message: "Username already exists",
            }, { status: 201 });

        }
        else{
        return NextResponse.json({
            success: true,
            message: "Username not found",
        },{status:200});
    }
    } catch (e) {
        console.error("Error is", e);
        return NextResponse.json({
            success: false,
            message: "Failed to check username",
            error: e.message,
        }, { status: 500 });
    }
}
