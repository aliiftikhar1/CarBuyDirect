import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';


export async function POST(request) {
    try {
        const data = await request.json(); 
        console.log("Payload is", data);

        const newCharges = await prisma.Charges.create({
            data:{
                tax: parseInt(data.tax),
                delivery_charges: parseInt(data.delivery_charges),
            },
        });

        return NextResponse.json({
            success: true,
            message: "Charges created successfully",
            data: newCharges,
        });
    } catch (e) {
        console.error("Error is", e);
        return NextResponse.json({
            success: false,
            message: "Failed to create charges",
            error: e.message,
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const data = await prisma.Charges.findMany();
        return NextResponse.json({
            success: true,
            data,
        });
    } catch (e) {
        return NextResponse.json({
            success: false,
            message: "Failed to fetch chargess",
            error: e.message,
        }, { status: 500 });
    }
}
