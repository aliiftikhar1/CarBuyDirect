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

