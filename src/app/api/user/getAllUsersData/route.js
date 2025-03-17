import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await prisma.user.findMany()
        if (!user) {
            return NextResponse.json({ success: true, message: "User not exist" }, { status: 201 })
        }
        return NextResponse.json({ status: 200, success: true, message: "sucessfully", data: user }, { status: 200 })
    } catch (error) {
        console.error("Error is", error.message);
        return NextResponse.json({
            success: false,
            message: "Failed to create user",
            error: e.message,
        }, { status: 500 });
    }
}