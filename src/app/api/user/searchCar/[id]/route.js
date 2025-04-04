import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")?.toLowerCase() || ""
    const id = params.id // Get the ID from the route parameters

    // Build the where clause based on search term without using mode: "insensitive"
    const whereClause = search
      ? {
          OR: [
            { CarSubmission: { vehicleMake: { contains: search.toLowerCase() } } },
            { CarSubmission: { vehicleModel: { contains: search.toLowerCase() } } },
            { CarSubmission: { condition: { contains: search.toLowerCase() } } },
            { CarSubmission: { vehicleYear: { contains: search } } },
          ],
        }
      : {} // If no search term is provided, return all auctions

    const response = await prisma.Auction.findMany({
      where: whereClause,
      include: {
        CarSubmission: {
          select: {
            id: true,
            condition: true,
            vehicleModel: true,
            vehicleMake: true,
            vehicleYear: true,
            webSlug: true,
          },
        },
        Seller: {
          select: {
            name: true,
          },
        },
      },
      take: 10, // Limit results to improve performance
    })

    return NextResponse.json(
      {
        success: true,
        message: "Auctions fetched successfully",
        data: response,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error occurred while fetching auctions",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

