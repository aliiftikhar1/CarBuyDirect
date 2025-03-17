import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all distinct vehicle makes
    const vehiclecondition = await prisma.carSubmission.findMany({
      select: {
        condition: true, // Only select the `vehicleMake` field
      },
      distinct: ["condition"], // Get distinct values
    });

    // Map the result to an array of vehicle makes
    const distinctcondition = vehiclecondition.map((make) => make.condition);

    // Return the response
    return NextResponse.json({ status: true, vehiclecondition: distinctcondition }, { status: 200 });
  } catch (error) {
    console.error("Error fetching vehicle condition:", error);
    return NextResponse.json(
      { status: false, message: "Failed to fetch vehicle condition" },
      { status: 500 }
    );
  }
}
