import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const body = await request.json()
    const { auctionId, userId, carId, bidAmount, currency } = body

    console.log("Received bid payload:", body)

    // Variables to store data we'll need outside the transaction
    let bidResult
    let auctionExtended = false
    let notificationData = null

    // First transaction - handle database operations only
    const result = await prisma.$transaction(
      async (tx) => {
        // Fetch auction with car info and all bidders
        const auction = await tx.auction.findUnique({
          where: { id: auctionId },
          include: {
            CarSubmission: true,
            Bids: {
              include: {
                User: true,
              },
            },
          },
        })

        if (!auction) throw new Error("Auction not found.")

        const now = new Date()
        const endDate = new Date(auction.endDate)
        const timeLeftInMinutes = (endDate.getTime() - now.getTime()) / (1000 * 60)

        // Create the bid
        const bid = await tx.bidding.create({
          data: {
            userId,
            auctionId,
            carId,
            price: bidAmount,
            currency,
          },
        })

        // If time is less than 5 minutes, extend auction
        if (timeLeftInMinutes <= 5 && timeLeftInMinutes > 0) {
          const extendedEndDate = new Date(endDate.getTime() + 5 * 60 * 1000) // Add 5 min

          await tx.auction.update({
            where: { id: auctionId },
            data: { endDate: extendedEndDate },
          })

          auctionExtended = true

          // Get all unique bidders from the auction
          const uniqueBidders = new Set()
          auction.Bids.forEach((bid) => uniqueBidders.add(bid.userId))

          // Add current bidder if not already in the list
          uniqueBidders.add(userId)

          // Prepare notification data to use outside transaction
          notificationData = {
            uniqueBidderIds: Array.from(uniqueBidders),
            auctionId,
            sellerId: auction.sellerId,
            bidAmount,
            vehicleYear: auction.CarSubmission.vehicleYear,
            vehicleModel: auction.CarSubmission.vehicleModel,
          }
        }

        return bid
      },
      {
        timeout: 500000, // Explicitly set timeout to default 5000ms for clarity
      },
    )

    bidResult = result

    // Handle notifications outside the transaction
    if (auctionExtended && notificationData) {
      // Get all bidder details
      const bidders = await prisma.user.findMany({
        where: {
          id: {
            in: notificationData.uniqueBidderIds,
          },
        },
        select: { id: true, email: true, name: true },
      })

      console.log("Bidders:", bidders)

      // Send notification to all bidders outside the transaction
      const notificationPromises = bidders.map((bidder) =>
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/notifications/timeExtended`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            price: notificationData.bidAmount,
            message: "Auction time has been extended by 5 minutes due to a recent bid. Visit our site to get this car.",
            auctionId: notificationData.auctionId,
            receiverId: notificationData.sellerId,
            senderId: bidder.id ,
            receiverEmail: bidder.email,
            userName: bidder.name,
            vehicleYear: notificationData.vehicleYear,
            vehicleModel: notificationData.vehicleModel,
          }),
        }),
      )

      // Wait for all notifications to be sent
      await Promise.all(notificationPromises)
    }

    return NextResponse.json(
      {
        success: true,
        message: auctionExtended
          ? "Bid placed and auction extended by 5 minutes. All bidders notified."
          : "Bid placed successfully.",
        data: bidResult,
        auctionExtended: auctionExtended,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error placing bid:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const bid = await prisma.bidding.findMany({
      include: {
        Auction: true,
        User: true,
        CarSubmission: true,
      }
    });

    if (!bid) {
      return NextResponse.json(
        { success: false, message: "Bid not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: bid },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}