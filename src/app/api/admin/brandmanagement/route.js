import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';


export async function POST(request) {
    try {
        const data = await request.json(); 
        console.log("Payload is", data);

        const newBrand = await prisma.Brand.create({
            data: {
                name: data.name,
                description: data.description,
                image: data.image,
            },
           
        });

        return NextResponse.json({
            success: true,
            message: "Brand created successfully",
            data: newBrand,
        });
    } catch (e) {
        console.error("Error is", e);
        return NextResponse.json({
            success: false,
            message: "Failed to create Brand",
            error: e.message,
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const data = await prisma.Brand.findMany();
        console.log("Data is", data);
        return NextResponse.json({
            success: true,
            data,
        });
    } catch (e) {
        return NextResponse.json({
            success: false,
            message: "Failed to fetch Brand",
            error: e.message,
        }, { status: 500 });
    }
}
