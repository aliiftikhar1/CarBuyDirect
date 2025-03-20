import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
    try {
        const id = parseInt(params.id);
        const data = await request.json();
        console.log("Payload:", data);

        // Fetch auction with bids and hold payments
        const auction = await prisma.auction.findUnique({
            where: { id },
            include: {
                HoldPayments: true,
                Bids: {
                    orderBy: { createdAt: "desc" }, // Get latest bid directly
                    take: 1,
                },
            },
        });
        

        if (!auction) {
            return NextResponse.json({ success: false, message: "Auction not found" }, { status: 404 });
        }

        if (auction.status === "Ended" || auction.status === "Sold") {
            return NextResponse.json({ success: false, message: "Auction already ended" }, { status: 400 });
        }

        const latestBid = auction.Bids[0];
        if (!latestBid) {
            return NextResponse.json({ success: false, message: "No bids found for this auction" }, { status: 400 });
        }
        
        const holdPayment = auction.HoldPayments.find(payment => payment.userId == latestBid.userId);
        console.log("Auction:", auction);
        console.log("Hold Payment:", holdPayment);
        if (!holdPayment) {
            return NextResponse.json({ success: false, message: "Hold payment not found" }, { status: 400 });
        }

        console.log("Auction Found:", auction);
        console.log("Latest Bid:", latestBid);
        console.log("Hold Payment:", holdPayment);

        // Capture payment via Stripe API
        const stripeResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/capture-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                paymentIntentId: holdPayment.paymentIntentId,
                userId: latestBid.userId,
                amount: latestBid.price,
                transferDescription: `The payment of Auction ${auction.id} is successful!`,
            }),
        });

        if (!stripeResponse.ok) {
            console.error("Stripe API Error:", await stripeResponse.text());
            return NextResponse.json({ success: false, message: "Payment capture failed" }, { status: 500 });
        }

        console.log("Stripe Response:", await stripeResponse.json());

        
        if (stripeResponse.ok) {
        
        const updatedAuction = await prisma.auction.update({
            where: { id },
            data: { status: "Sold" },
        });

        await prisma.Sold.create({
            data: {
                auctionId: updatedAuction.id,
                userId: latestBid.userId,
                price: data.price,
                currency: data.currency,
            },
        });

        return NextResponse.json({ success: true, data: updatedAuction }, { status: 200 });
    }
    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
