import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const endedAuctions = await prisma.auction.findMany({
      where: {
        status: "ended",
      },
      include: {
        CarSubmission: {
          select: {
            vehicleMake: true,
            vehicleModel: true,
            vehicleYear: true,
            mileage: true,
            mileageUnit: true,
            condition: true,
          },
        },
        Bids: {
          orderBy: {
            price: "desc",
          },
          take: 1,
          select: {
            price: true,
            currency: true,
          },
        },
      },
    })

    const formattedAuctions = endedAuctions.map((auction) => ({
      ...auction,
      highestBid: auction.Bids[0] || null,
    }))

    return NextResponse.json(formattedAuctions)
  } catch (error) {
    console.error("Error fetching ended auctions:", error)
    return NextResponse.json({ error: "Error fetching ended auctions" }, { status: 500 })
  }
}

