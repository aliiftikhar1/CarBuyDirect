import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all distinct vehicle makes
    const vehicleexteriorColor = await prisma.carSubmission.findMany({
      select: {
        exteriorColor: true, // Only select the `vehicleMake` field
      },
      distinct: ["exteriorColor"], // Get distinct values
    });

    // Map the result to an array of vehicle makes
    const distinctexteriorColor = vehicleexteriorColor.map((make) => make.exteriorColor);

    // Return the response
    return NextResponse.json({ status: true, vehicleexteriorColor: distinctexteriorColor }, { status: 200 });
  } catch (error) {
    console.error("Error fetching vehicle exteriorColor:", error);
    return NextResponse.json(
      { status: false, message: "Failed to fetch vehicle exteriorColor" },
      { status: 500 }
    );
  }
}
