import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        const data = await request.json();

        // Validate required fields
        if (!data.name || !data.email || !data.password) {
            return NextResponse.json({
                success: false,
                message: "Name, email, and password are required.",
            }, { status: 400 });
        }

        console.log("Received payload:", data);

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });

        if (existingUser) {
            console.log("Email already exists:", data.email);
            return NextResponse.json({
                success: false,
                message: "This email is already registered.",
            }, { status: 409 }); // 409 Conflict
        }
        const existingUsername = await prisma.user.findUnique({
            where: {
                username: data.username,
            },
        });

        if (existingUsername) {
            console.log("username already exists:", data.username);
            return NextResponse.json({
                success: false,
                message: "This username is already registered.",
            }, { status: 409 }); // 409 Conflict
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create a new user
        const newUser = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                type: data.type || "user", // Default type if not provided
                image: data.image || null,
                username: data.username || null,
                bio: data.bio || null,
                password: hashedPassword,
                address: data.address || null,
                city: data.city || null,
                country: data.country || null,
                province: data.province || null,
                zipcode: data.zipcode || null,
                status: data.status || "active", // Default status
                verified: data.verified === "on" ? true : false,
                phoneNo: data.phoneNo || null,
            },
        });

        console.log("User created successfully:", newUser);

        return NextResponse.json({
            success: true,
            message: "User created successfully.",
            data: newUser,
        });
    } catch (error) {
        console.error("Error creating user:", error.message);
        return NextResponse.json({
            success: false,
            message: "Failed to create user.",
            error: error.message,
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const users = await prisma.user.findMany();
        console.log("Fetched users:", users);

        return NextResponse.json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error("Error fetching users:", error.message);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch users.",
            error: error.message,
        }, { status: 500 });
    }
}
