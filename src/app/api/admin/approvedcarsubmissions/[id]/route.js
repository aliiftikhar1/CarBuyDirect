import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    const id = parseInt(params.id);

    if (isNaN(id)) {
        return NextResponse.json(
            { success: false, message: "Invalid ID provided" },
            { status: 400 }
        );
    }

    let data;
    try {
        data = await request.json();
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Invalid JSON payload" },
            { status: 400 }
        );
    }

    const {
        firstname,
        lastname,
        email,
        phone,
        vehicleMake,
        vehicleModel,
        vehicleYear,
        vin,
        mileage,
        mileageUnit,
        price,
        currency,
        country,
        postal,
        notes,
        description,
        highlights,
        specs,
        review,
        status,
    } = data;

    try {
        const submission = await prisma.CarSubmission.findUnique({
            where: { id },
        });

        if (!submission) {
            return NextResponse.json(
                { success: false, message: "Car submission not found" },
                { status: 404 }
            );
        }

        const updatedSubmission = await prisma.CarSubmission.update({
            where: { id },
            data: {
                firstname,
                lastname,
                email,
                phone,
                vehicleMake,
                vehicleModel,
                vehicleYear,
                vin,
                mileage,
                mileageUnit,
                price,
                currency,
                country,
                postal,
                notes,
                description,
                highlights,
                specs,
                review,
                status,
            },
        });

        return NextResponse.json(
            { success: true, message: "Car updated successfully", data: updatedSubmission },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating car submission:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update car submission" },
            { status: 500 }
        );
    }
}

export async function DELETE(request, {params}){
    const id = params.id
    try {
        const deletesubmisssion = await prisma.CarSubmission.delete({
            where:{
                id: parseInt(id)
            }
        })
        return NextResponse.json(
            { success: true, message: "submission deleted successfully",  },
            { status: 200 }
        );
        
    } catch (error) {
        return NextResponse.json(
            {success:false,message:"Failed to delete submission"},{status:500}
        )
    }
}