import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

export async function GET(request,{params}) {
    try {
        const { id } = await params;

        const deletedUser = await prisma.Subcategory.findUnique({
            where: { id: id },
        });

        return NextResponse.json({
            success: true,
            message: "Subcategory Fetched successfully",
            data: deletedUser,
        });
    } catch (e) {
        console.error("Error is", e);
        return NextResponse.json({
            success: false,
            message: "Failed to Fetch category",
            error: e.message,
        }, { status: 500 });
    }
}


export async function PUT(request,{params}) {
    try {
        const id = await params.id;
        const data = await request.json();
        console.log("Payload is : ",id,data);
        const {name, description, image,category_id, coverimage} = data;

        const updatedUser = await prisma.Subcategory.update({
            where: { id: id },
            data: {name, description, image : image?image:undefined,category_id, coverimage: coverimage?coverimage:undefined},
        });

        return NextResponse.json({
            success: true,
            message: "category updated successfully",
            data: updatedUser,
        });
    } catch (e) {
        console.error("Error is", e);
        return NextResponse.json({
            success: false,
            message: "Failed to update category",
            error: e.message,
        }, { status: 500 });
    }
}

export async function DELETE(request,{params}) {
    try {
        const { id } = await params;

        const deletedUser = await prisma.Subcategory.delete({
            where: { id: id },
        });

        return NextResponse.json({
            success: true,
            message: "category deleted successfully",
            data: deletedUser,
        });
    } catch (e) {
        console.error("Error is", e);
        return NextResponse.json({
            success: false,
            message: "Failed to delete category",
            error: e.message,
        }, { status: 500 });
    }
}
