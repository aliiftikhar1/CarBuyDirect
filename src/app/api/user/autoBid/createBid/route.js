import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();
    console.log("Payload is:", data);

    const response = await prisma.bidding.create({
      data: {
        userId: data.userId,
        auctionId: data.auctionId,
        carId: data.carId,
        price: data.bidAmount,
        currency: data.currency,
        status:'autobid'
      },
    });

    return NextResponse.json(
      { success: true, message: "Bid placed successfully", data: response },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
