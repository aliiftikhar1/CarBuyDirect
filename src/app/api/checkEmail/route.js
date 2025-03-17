import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
    const data = await request.json()
    console.log("email is ", data)
    try {

        console.log("email is ", data.email)
        const user = await prisma.user.findUnique({ where: { email: data.email } });
        console.log("User checked")
        if (user) {
            return NextResponse.json({ success: true, message: 'User Already exist on this email', status: 200 })
        } else {
            return NextResponse.json({ success: true, message: 'Email not exist', status: 201 })
        }

    } catch (error) {
        return NextResponse.json({ success: false, message: "Error checking email", status: 500 })
    }
}