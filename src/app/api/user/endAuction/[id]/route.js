import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import ReserveNotMet from "../ReserveNotMet";
import ReserveNear from "../ReserveNear";
import ReserveMet from "../ReserveMet";
import WithoutReserve from "../WithoutReserve";

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
            if (reserveStatus === "Reserve not met") {
                return await ReserveNotMet({ latestBid, auction });
            } else if (reserveStatus === "Reserve near") {
                return await ReserveNear({ latestBid, auction });
            }else if(reserveStatus === "Reserve met"){
                return await ReserveMet({ latestBid, auction });
            }
        }
        else{
            return await WithoutReserve({ latestBid, auction });
        }
      
    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
