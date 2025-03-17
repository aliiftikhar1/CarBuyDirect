import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
    const data = await request.json();
    const { email, password } = data;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
                type:'seller'
            },
        });

        if (user) {
            // Compare the password with the hashed one in the database
            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            if (isPasswordValid) {
                // You can return a success response with user info or a JWT token here
                return NextResponse.json({
                    success: true,
                    message: "Login successful",
                    status: 200,
                    user: user, // Optionally return user details or a token
                });
            } else {
                return NextResponse.json({
                    success: false,
                    message: "Invalid password",
                    status: 400,
                });
            }
        } else {
            return NextResponse.json({
                success: false,
                message: "User not found",
                status: 404,
            });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Error in login",
            status: 500,
        });
    }
}
