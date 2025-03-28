import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await prisma.Sold.findMany({
        include:{
            User:true,
            Auction:{
                include:{
                    CarSubmission:{
                        include:{
                            SubmissionImages:true
                        }
                    },
                }
            },
            
        },
        orderBy: {
            createdAt: 'desc', 
        },
    });

    if (!response || response.length === 0) {
      return NextResponse.json(
        { success: false, message: "No Sold data found", data: [] },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "SOld data fetched successfully", data: response },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching Sold data:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching sold data" },
      { status: 500 }
    );
  }
}
