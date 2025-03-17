import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: Fetch a bid by ID
export async function GET(request, { params }) {
  const { id } = params;
  try {
    const bid = await prisma.bidding.findUnique({
      where: { id: parseInt(id) },
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

// PUT: Update a bid by ID
export async function PUT(request, { params }) {
  const { id } = params;
  try {
    const data = await request.json();

    const updatedBid = await prisma.bidding.update({
      where: { id: parseInt(id) },
      data: {
        price: data.bidAmount,
        currency: data.currency,
      },
    });

    return NextResponse.json(
      { success: true, message: "Bid updated successfully", data: updatedBid },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete a bid by ID
export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    await prisma.bidding.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { success: true, message: "Bid deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
