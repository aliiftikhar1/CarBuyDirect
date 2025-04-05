import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request, { params }) {
  const id = params.id

  try {
    // Find the user with their pricePlan field
    const user = await prisma.user.findUnique({
      where: { id: Number.parseInt(id) },
      select: {
        id: true,
        pricePlan: true,
        pricePlanEndDate: true, // Fixed typo: pricePanEndDate -> pricePlanEndDate
      },
    })

    if (!user) {
      return NextResponse.json({ success: false, message: "User does not exist" }, { status: 404 })
    }

    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error is", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user price plan",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function PUT(request, { params }) {
  const id = params.id

  try {
    // Parse the request body
    const body = await request.json()
    const { pricePlan, amount } = body
    console.log("pricePlan is", pricePlan)

    // Validate the price plan
    if (!pricePlan || (pricePlan !== "free" && pricePlan !== "premium")) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid price plan. Must be 'free' or 'premium'.",
        },
        { status: 400 },
      )
    }

    let pricePlanEndDate = null
    if (pricePlan === "premium") {
      // Set the end date to 30 days from now for premium plan
      pricePlanEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: Number.parseInt(id) },
      select: { id: true },
    })

    if (!existingUser) {
      return NextResponse.json({ success: false, message: "User does not exist" }, { status: 404 })
    }

    // Update the user's price plan
    const updatedUser = await prisma.user.update({
      where: { id: Number.parseInt(id) },
      data: {
        pricePlan: pricePlan,
        pricePlanEndDate: pricePlanEndDate,
      },
      select: {
        id: true,
        pricePlan: true,
        pricePlanEndDate: true,
      },
    })
    function generateTransactionId() {
      const transactionId = Math.floor(10000000 + Math.random() * 90000000);  
      return `txn_${transactionId}`;
  }
    // Create a transaction record if this is a premium plan and transaction details are provided
    if (pricePlan === "premium"  && amount) {
      await prisma.transaction.create({
        data: {
          userId: Number.parseInt(id),
          amount: amount,
          trancastion_id: generateTransactionId(),
          order_id: "Price Plan Payment",
          currency: "USD",
          type: pricePlanEndDate ? "Price Plan Renewal" : "Price Plan Purchase",
          status: "Paid",
        },
      })
    }

    return NextResponse.json(
      {
        success: true,
        message: "Price plan updated successfully",
        user: updatedUser,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error is", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update user price plan",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

// You can also add a PATCH method if you prefer
export async function PATCH(request, { params }) {
  return PUT(request, { params })
}

