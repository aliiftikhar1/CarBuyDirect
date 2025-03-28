import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { sendCarPaymentEmail } from "@/lib/PaymentEmail"
export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json()
    const { auction, latestBid, notificationId } = body

    if (!auction || !latestBid) {
      return NextResponse.json({ error: "Missing required auction or bid data" }, { status: 400 })
    }

    function generateTransactionId() {
      const transactionId = Math.floor(10000000 + Math.random() * 90000000);  
      return `txn_${transactionId}`;
  }
  const newtransaction = await prisma.transaction.create({
      data: {
          userId: latestBid.userId,
          amount: latestBid.price,
          trancastion_id:generateTransactionId(),  
          order_id: 'Car Payment succeeded',
          currency: "USD",
          type: "Car Payment",
          status: "Paid",  
      },
  });
  if(!newtransaction){
    return NextResponse.json({ error: "Error making new transaction" }, { status: 400 })
  }

    // Prepare notification payload
    const Finalpayload = {
      price: latestBid.price,
      message: "Car Sold Out to"+" "+auction.Bids[auction.Bids.length-1].User.name,
      auctionId: auction.id,
      receiverId: auction.CarSubmission.User.id,
      senderId: latestBid.userId,
      userType: "buyer",
      regarding: "payment-done",
      replyOf: notificationId,
      userName: auction.CarSubmission.User.name,
      receiverEmail: auction.CarSubmission.User.email,
      vehicleYear: auction.CarSubmission.vehicleYear,
      vehicleModel: auction.CarSubmission.vehicleModel,
    }

    // Send notification
    const notificationResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/notifications/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Finalpayload),
    })

    if (!notificationResponse.ok) {
      const errorData = await notificationResponse.json()
      console.error("Notification API error:", errorData)
      // Continue with the process even if notification fails
    }

    // Update auction status to "Sold"
    const updatedAuction = await prisma.auction.update({
      where: { id: auction.id },
      data: { status: "Sold" },
    })

    // Create a record in the Sold table
    await prisma.Sold.create({
      data: {
        auctionId: updatedAuction.id,
        userId: latestBid.userId,
        price: latestBid.price,
        currency: latestBid.currency || "USD", // Default to USD if not provided
      },
    })

    await sendCarPaymentEmail(latestBid.User.email, auction.CarSubmission)

    return NextResponse.json({
      success: true,
      message: "Auction updated successfully",
      updatedAuction,
    })
  } catch (error) {
    console.error("Error updating auction:", error)
    return NextResponse.json({ error: "Failed to update auction", details: error.message }, { status: 500 })
  } finally {
    // Disconnect from Prisma client to prevent connection leaks
    await prisma.$disconnect()
  }
}

