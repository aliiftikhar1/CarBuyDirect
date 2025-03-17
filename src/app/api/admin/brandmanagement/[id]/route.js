import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

export async function GET(request,{params}) {
    try {
        const { id } = await params;

        const deletedBrand = await prisma.Brand.findUnique({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({
            success: true,
            message: "Brand Fetched successfully",
            data: deletedBrand,
        });
    } catch (e) {
        console.error("Error is", e);
        return NextResponse.json({
            success: false,
            message: "Failed to Fetch Brand",
            error: e.message,
        }, { status: 500 });
    }
}


export async function PUT(request,{params}) {
    try {
        const id = await params.id;
        const data = await request.json();
        console.log("Payload is : ",id,data);
        const {name, description, image} = data;

        const updatedBrand = await prisma.Brand.update({
            where: { id: parseInt(id) },
            data: {name, description, image: image?image:undefined,},
        });

        return NextResponse.json({
            success: true,
            message: "brand updated successfully",
            data: updatedBrand,
        });
    } catch (e) {
        console.error("Error is", e);
        return NextResponse.json({
            success: false,
            message: "Failed to update brand",
            error: e.message,
        }, { status: 500 });
    }
}

export async function DELETE(request,{params}) {
    try {
        const { id } = await params;

        const deletedBrand = await prisma.Brand.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({
            success: true,
            message: "brand deleted successfully",
            data: deletedBrand,
        });
    } catch (e) {
        console.error("Error is", e);
        return NextResponse.json({
            success: false,
            message: "Failed to delete brand",
            error: e.message,
        }, { status: 500 });
    }
}
