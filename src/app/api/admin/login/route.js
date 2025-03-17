import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
    const data = await request.json();
    const { username, password } = data;
    console.log("Payload is : ",data)

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: username,
            },
        });

        if (user) {
            // Compare the password with the hashed one in the database
            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            if (isPasswordValid) {

                if(user.type==='admin'){
                // You can return a success response with user info or a JWT token here
                return NextResponse.json({
                    success: true,
                    message: "Login successful",
                    status: 200,
                    user: user, // Optionally return user details or a token
                });
            }
            else{
                return NextResponse.json({
                    success: false,
                    message: "This User is not admin",
                    status: 400,
                });
            }
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
