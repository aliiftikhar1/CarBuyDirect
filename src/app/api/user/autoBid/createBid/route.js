import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const data = await request.json()
    console.log("Payload is:", data)

    // Use a transaction to ensure both operations happen atomically
    const result = await prisma.$transaction(async (tx) => {
      // First, get the auction details to check the end date
      const auction = await tx.auction.findUnique({
        where: {
          id: data.auctionId,
        },
        select: {
          endDate: true,
        },
      })

      if (!auction) {
        throw new Error("Auction not found")
      }

      // Check if the bid is being placed in the last 5 minutes
      const now = new Date()
      const endDate = new Date(auction.endDate)
      const timeLeftInMinutes = (endDate - now) / (1000 * 60)

      let auctionExtended = false

      let newdata
      // If less than 5 minutes left, extend the auction by 5 minutes
      if (timeLeftInMinutes <= 5 && timeLeftInMinutes > 0) {
        const newEndDate = new Date(endDate.getTime() + 5 * 60 * 1000) // Add 5 minutes
        newdata = "New End date is : "+ newEndDate
        // Update the auction end date
        await tx.auction.update({
          where: {
            id: data.auctionId,
          },
          data: {
            endDate: newEndDate,
          },
        })

        auctionExtended = true
      }

      // Create the bid record
      const bid = await tx.bidding.create({
        data: {
          userId: data.userId,
          auctionId: data.auctionId,
          carId: data.carId,
          price: data.bidAmount,
          currency: data.currency,
          status:'autobid'
      
        },
      })

      return { bid, auctionExtended }
    })

    return NextResponse.json(
      {
        success: true,
        message: result.auctionExtended
          ? "Bid placed successfully. Auction extended by 5 minutes."
          : "Bid placed successfully",
        data: result.bid,
        auctionExtended: result.auctionExtended,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error placing bid:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
 