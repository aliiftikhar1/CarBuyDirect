import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all distinct vehicle makes
    const bodyType = await prisma.carSubmission.findMany({
      select: {
        bodyType: true, // Only select the `vehicleMake` field
      },
      distinct: ["bodyType"], // Get distinct values
    });

    // Map the result to an array of vehicle makes
    const distinctbodyType = bodyType.map((make) => make.bodyType);

    // Return the response
    return NextResponse.json({ status: true, bodyType: distinctbodyType }, { status: 200 });
  } catch (error) {
    console.error("Error fetching vehicle bodyType:", error);
    return NextResponse.json(
      { status: false, message: "Failed to fetch vehicle bodyType" },
      { status: 500 }
    );
  }
}
