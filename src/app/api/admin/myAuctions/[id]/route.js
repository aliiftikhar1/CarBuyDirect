import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request,{params}) {
    const id = params.id
  try {
    const auctions = await prisma.auction.findMany({
        where:{
            sellerId: parseInt(id),
            status:'Live'
        },
      include: {
        CarSubmission: true,
        Bids: {
          include: {
            User: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(auctions)
  } catch (error) {
    console.error("Error fetching auctions:", error)
    return NextResponse.json({ error: "Error fetching auctions" }, { status: 500 })
  }
}

