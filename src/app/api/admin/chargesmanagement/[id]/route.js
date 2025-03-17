import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

export async function GET(request,{params}) {
    try {
        const { id } = await params;

        const deletedCharges = await prisma.Charges.findUnique({
            where: { id: id },
        });

        return NextResponse.json({
            success: true,
            message: "Charges Fetched successfully",
            data: deletedCharges,
        });
    } catch (e) {
        console.error("Error is", e);
        return NextResponse.json({
            success: false,
            message: "Failed to Fetch charges",
            error: e.message,
        }, { status: 500 });
    }
}


export async function PUT(request,{params}) {
    try {
        const id = await params.id;
        const data = await request.json();
        console.log("Payload is : ",id,data);
        

        const updatedCharges = await prisma.Charges.update({
            where: { id: id },
            data: {
                tax: parseInt(data.tax),
                delivery_charges: parseInt(data.delivery_charges),
                updatedAt: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            message: "Charges updated successfully",
            data: updatedCharges,
        });
    } catch (e) {
        console.error("Error is", e);
        return NextResponse.json({
            success: false,
            message: "Failed to update charges",
            error: e.message,
        }, { status: 500 });
    }
}

export async function DELETE(request,{params}) {
    try {
        const { id } = await params;

        const deletedCharges = await prisma.Charges.delete({
            where: { id: id },
        });

        return NextResponse.json({
            success: true,
            message: "Charges deleted successfully",
            data: deletedCharges,
        });
    } catch (e) {
        console.error("Error is", e);
        return NextResponse.json({
            success: false,
            message: "Failed to delete charges",
            error: e.message,
        }, { status: 500 });
    }
}
