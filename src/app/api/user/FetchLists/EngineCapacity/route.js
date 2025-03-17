import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all distinct vehicle makes
    const vehicleengineCapacity = await prisma.carSubmission.findMany({
      select: {
        engineCapacity: true, // Only select the `vehicleMake` field
      },
      distinct: ["engineCapacity"], // Get distinct values
    });

    // Map the result to an array of vehicle makes
    const distinctengineCapacity = vehicleengineCapacity.map((make) => make.engineCapacity);

    // Return the response
    return NextResponse.json({ status: true, vehicleengineCapacity: distinctengineCapacity }, { status: 200 });
  } catch (error) {
    console.error("Error fetching vehicle engineCapacity:", error);
    return NextResponse.json(
      { status: false, message: "Failed to fetch vehicle engineCapacity" },
      { status: 500 }
    );
  }
}
