import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all distinct vehicle makes
    const vehiclefuelType = await prisma.carSubmission.findMany({
      select: {
        fuelType: true, // Only select the `vehicleMake` field
      },
      distinct: ["fuelType"], // Get distinct values
    });

    // Map the result to an array of vehicle makes
    const distinctfuelType = vehiclefuelType.map((make) => make.fuelType);

    // Return the response
    return NextResponse.json({ status: true, vehiclefuelType: distinctfuelType }, { status: 200 });
  } catch (error) {
    console.error("Error fetching vehicle fuelType:", error);
    return NextResponse.json(
      { status: false, message: "Failed to fetch vehicle fuelType" },
      { status: 500 }
    );
  }
}
