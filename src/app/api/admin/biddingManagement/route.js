import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await prisma.Bidding.findMany({
        include: {
            User: true,
            Auction: true,
            CarSubmission: {
                include: {
                    SubmissionImages: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc', 
        },
    });
    
    if (!response || response.length === 0) {
      return NextResponse.json(
        { success: false, message: "No bidding data found", data: [] },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Bidding data fetched successfully", data: response },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching bidding data:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching bidding data" },
      { status: 500 }
    );
  }
}
