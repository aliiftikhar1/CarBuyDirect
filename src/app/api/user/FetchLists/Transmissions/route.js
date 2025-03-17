import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all distinct vehicle makes
    const vehicletransmission = await prisma.carSubmission.findMany({
      select: {
        transmission: true, // Only select the `vehicleMake` field
      },
      distinct: ["transmission"], // Get distinct values
    });

    // Map the result to an array of vehicle makes
    const distincttransmission = vehicletransmission.map((make) => make.transmission);

    // Return the response
    return NextResponse.json({ status: true, vehicletransmission: distincttransmission }, { status: 200 });
  } catch (error) {
    console.error("Error fetching vehicle transmission:", error);
    return NextResponse.json(
      { status: false, message: "Failed to fetch vehicle transmission" },
      { status: 500 }
    );
  }
}
