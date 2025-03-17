import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all distinct vehicle makes
    const vehicleMakes = await prisma.carSubmission.findMany({
      select: {
        vehicleMake: true, // Only select the `vehicleMake` field
      },
      distinct: ["vehicleMake"], // Get distinct values
    });

    // Map the result to an array of vehicle makes
    const distinctMakes = vehicleMakes.map((make) => make.vehicleMake);

    // Return the response
    return NextResponse.json({ status: true, vehicleMakes: distinctMakes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching vehicle makes:", error);
    return NextResponse.json(
      { status: false, message: "Failed to fetch vehicle makes" },
      { status: 500 }
    );
  }
}
