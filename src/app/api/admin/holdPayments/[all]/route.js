import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    // Fix: Prisma model names should be camelCase in queries
    const holdPayments = await prisma.holdPayments.findMany({
      include: {
        user: true,
        auction: {
          include: {
            CarSubmission: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: holdPayments })
  } catch (error) {
    console.error("Error fetching hold payments:", error)
    // Fix: Updated error message to reflect what we're actually fetching
    return NextResponse.json(
      { success: false, message: `Failed to fetch hold payments: ${error.message}` },
      { status: 500 },
    )
  }
}

