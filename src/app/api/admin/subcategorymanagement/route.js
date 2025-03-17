import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';


export async function POST(request) {
    try {
        const data = await request.json(); 
        console.log("Payload is", data);

        const newsubcategory = await prisma.Subcategory.create({
            data
        });

        return NextResponse.json({
            success: true,
            message: "subcategory created successfully",
            data: newsubcategory,
        });
    } catch (e) {
        console.error("Error is", e);
        return NextResponse.json({
            success: false,
            message: "Failed to create category",
            error: e.message,
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const data = await prisma.Subcategory.findMany();
        console.log("Data is", data);
        return NextResponse.json({
            success: true,
            data,
        });
    } catch (e) {
        return NextResponse.json({
            success: false,
            message: "Failed to fetch categories",
            error: e.message,
        }, { status: 500 });
    }
}
