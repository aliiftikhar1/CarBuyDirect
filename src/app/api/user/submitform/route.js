import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
const MAX_RETRIES = 3; // Number of retries for failed image uploads

export async function POST(request) {
    try {
        const data = await request.json();
        console.log("Payload is:", data);

        const {
            firstName,
            lastName,
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
            category,
            bodyType,
            transmission,
            engineCapacity,
            fuelType,
            exteriorColor,
            condition,
            reserved,
            reservedPrice,
            buyPrice,
            buy,
            sellerId,
            files,
        } = data;

        // Create Car Submission
        const carsubmission = await prisma.carSubmission.create({
            data: {
                firstname: firstName,
                lastname: lastName,
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
                description,
                highlights,
                specs,
                notes,
                category,
                bodyType,
                transmission,
                engineCapacity,
                fuelType,
                exteriorColor,
                condition,
                status: "Pending",
                sellerId, // Replace with actual seller ID
                reserved: reserved === 'True' ? true : false,
                reservedPrice: parseInt(reservedPrice),
                buy: buy === 'True' ? true : false,
                buyPrice: parseInt(buyPrice),
                webSlug:uuidv4()
            },
        });

        // Function to upload images with retries
        const uploadImageWithRetry = async (image, submissionId, attempt = 1) => {
            try {
                await prisma.carSubmissionImage.create({
                    data: {
                        submissionId,
                        name: image.name,
                        type: image.type,
                        size: image.size,
                        data: image.data, // This is now the base64 string
                    },
                });
            } catch (error) {
                if (attempt < MAX_RETRIES) {
                    console.warn(
                        `Retrying image upload (Attempt ${attempt + 1}/${MAX_RETRIES})`
                    );
                    await uploadImageWithRetry(image, submissionId, attempt + 1);
                } else {
                    console.error("Failed to upload image after maximum retries:", error);
                    throw error;
                }
            }
        };


        if (files && Array.isArray(files)) {
            for (const img of files) {
                if (img && img.data) {
                    await uploadImageWithRetry(img, carsubmission.id);
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: "Car submission created successfully.",
        });
    } catch (error) {
        console.error("Error processing car submission:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
