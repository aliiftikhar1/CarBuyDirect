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
                CarSubmission: {
                    select: {
                        User: true,
                        reserved: true,
                        reservedPrice: true,
                        vehicleYear: true,
                        vehicleModel: true
                    },
                },
                HoldPayments: true,
                Bids: {
                    include: {
                        User: true,
                    },
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
        console.log("Latest Bid:", latestBid);
        if (!latestBid) {
            return NextResponse.json({ success: false, message: "No bids found for this auction" }, { status: 400 });
        }

        function getReserveStatus(currentPrice, reservedPrice) {
            if (currentPrice >= reservedPrice) {
                return "Reserve met"
            } else if (currentPrice >= reservedPrice * 0.9) {
                return "Reserve near"
            } else {
                return "Reserve not met"
            }
        }
        if (auction.CarSubmission.reserved == true) {
            const reserveStatus = getReserveStatus(latestBid.price, auction.CarSubmission.reservedPrice);
            console.log("Reserve Status:", reserveStatus);
            console.log("Auction:", auction);
            if (reserveStatus == "Reserve not met") {
                await prisma.Auction.update({
                    where: { id: auction.id },
                    data: {
                        status: "Ended",
                    },
                });
                return NextResponse.json({ success: false, message: "Reserve not met" }, { status: 400 });
            } else if (reserveStatus == "Reserve near") {
                let Finalpayload = {
                    price: latestBid.price,
                    message: "Top bidder of the auction has reached near the reserve price. Do you want to sell the vehicle on mentioned price or do you want to negotiate with buyer?",
                    auctionId: auction.id,
                    receiverId: auction.CarSubmission.User.id,
                    senderId: latestBid.userId,
                    userType: "buyer",
                    regarding: "endAuction",
                    userName: auction.CarSubmission.User.name,
                    receiverEmail: auction.CarSubmission.User.email,
                    vehicleYear: auction.CarSubmission.vehicleYear,
                    vehicleModel: auction.CarSubmission.vehicleModel,
                }
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/notifications/deal`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(Finalpayload),
                })
                const data = await response.json();
                console.log("Response:", data);
                console.log("FInal Payload:", Finalpayload);
                await prisma.Auction.update({
                    where: { id: auction.id },
                    data: {
                        status: "Ended",
                    },
                });

                return NextResponse.json({ success: false, message: "Reserve Near" }, { status: 400 });
            }

            const holdPayment = auction.HoldPayments.find(payment => payment.userId == latestBid.userId);
            if (!holdPayment) {
                return NextResponse.json({ success: false, message: "Hold payment not found" }, { status: 400 });
            }
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
