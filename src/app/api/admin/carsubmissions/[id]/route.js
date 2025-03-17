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

    console.log("data is ", data);

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
        // brand,
        category,
        bodyType,
        transmission,
        engineCapacity,
        fuelType,
        exteriorColor,
        condition,
        reserved,
        reservedPrice,
        imageLabels,
        webSlug
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
        if (submission.status === 'in_auction') {
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
                    // brand,
                    category,
                    bodyType,
                    transmission,
                    engineCapacity,
                    fuelType,
                    exteriorColor,
                    condition,
                    reserved: reserved === 'True' ? true : false,
                    reservedPrice: parseInt(reservedPrice),
                    webSlug
                },
            });

            if (imageLabels && typeof imageLabels === 'object') {
                const imageUpdatePromises = Object.entries(imageLabels).map(([imageId, label]) =>
                    prisma.CarSubmissionImage.update({
                        where: { id: parseInt(imageId) },
                        data: { label },
                    })
                );

                await Promise.all(imageUpdatePromises);
            }

            return NextResponse.json(
                { success: true, message: "Car updated successfully", data: updatedSubmission },
                { status: 200 }
            );
        }
        else {
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
                    category,
                    bodyType,
                    transmission,
                    engineCapacity,
                    fuelType,
                    exteriorColor,
                    condition,
                    status,
                    reserved: reserved === 'True' ? true : false,
                    reservedPrice: parseInt(reservedPrice),
                    webSlug
                },
            });

            if (imageLabels && typeof imageLabels === 'object') {
                const imageUpdatePromises = Object.entries(imageLabels).map(([imageId, label]) =>
                    prisma.CarSubmissionImage.update({
                        where: { id: parseInt(imageId) },
                        data: { label },
                    })
                );

                await Promise.all(imageUpdatePromises);
            }

            return NextResponse.json(
                { success: true, message: "Car updated successfully", data: updatedSubmission },
                { status: 200 }
            );
        }


    } catch (error) {
        console.error("Error updating car submission:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update car submission" },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    const id = params.id;
    try {
        const deleteSubmission = await prisma.CarSubmission.delete({
            where: {
                id: parseInt(id)
            }
        });
        return NextResponse.json(
            { success: true, message: "Submission deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting car submission:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete submission" },
            { status: 500 }
        );
    }
}