import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all distinct vehicle makes
    const vehiclecategory = await prisma.carSubmission.findMany({
      select: {
        category: true, // Only select the `vehicleMake` field
      },
      distinct: ["category"], // Get distinct values
    });

    // Map the result to an array of vehicle makes
    const distinctcategory = vehiclecategory.map((make) => make.category);

    // Return the response
    return NextResponse.json({ status: true, vehiclecategory: distinctcategory }, { status: 200 });
  } catch (error) {
    console.error("Error fetching vehicle category:", error);
    return NextResponse.json(
      { status: false, message: "Failed to fetch vehicle category" },
      { status: 500 }
    );
  }
}
