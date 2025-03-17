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
    const { pricePlan } = body
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
      },
      select: {
        id: true,
        pricePlan: true,
      },
    })

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

