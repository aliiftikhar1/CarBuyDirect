import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const id = params.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        Submissions: {
          include: {
            SubmissionImages: true,
          },
        },
        Bids: {
          include: {
            Auction: {
              select: {
                CarSubmission: {
                  select: {
                    webSlug: true,
                  },
                },
              },
            },
          },
        },
        Auctions: true,
        HoldPayments: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: true, message: "User not exist" }, { status: 201 });
    }

    // 🛠️ Flatten Bids with webSlug
    const modifiedBids = user.Bids.map((bid) => ({
        "id": bid.id,
        "auctionId": bid.auctionId,
        "userId": bid.userId,
        "carId": bid.carId,
        "currency": bid.currency,
        "price": bid.price,
        "type": bid.type,
        "createdAt": bid.createdAt,
        "updatedAt": bid.updatedAt,
    //   ...bid,
      webSlug: bid.Auction?.CarSubmission?.webSlug || null,
    }));

    // Remove the nested Auction object from each bid
    const finalUser = {
      ...user,
      Bids: modifiedBids,
    };

    return NextResponse.json({ success: true, user: finalUser }, { status: 200 });

  } catch (e) {
    console.error("Error is", e);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user",
        error: e.message,
      },
      { status: 500 }
    );
  }
}
