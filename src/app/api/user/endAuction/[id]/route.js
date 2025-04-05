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
                        vehicleMake: true,
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
        //if there is no bid on auction then it simply ends and send notification to seller
        if(auction.Bids.length === 0){

            await prisma.auction.update({
                where: { id },
                data: {
                    status: "Ended",
                },
            });
            let Finalpayload = {
                price: 0,
                message: "your Auction has ended without any bids. We will reschedule the auction for you soon.",
                auctionId: auction.id,
                receiverId: auction.CarSubmission.User.id,
                senderId: 6,
                userType: "buyer",
                regarding: "noBids",
                userName: auction.CarSubmission.User.name,
                receiverEmail: auction.CarSubmission.User.email,
                vehicleYear: auction.CarSubmission.vehicleYear,
                vehicleModel: auction.CarSubmission.vehicleModel,
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/notifications/notify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Finalpayload),
            })
            const data = await response.json();
            return NextResponse.json({ success: true, message: "No bids found" }, { status: 200 });
        }
        const holdPayment = auction.HoldPayments.filter(payment=> payment.status === "requires_capture" )
        if(holdPayment.length === 0){
            await prisma.auction.update({
                where: { id },
                data: {
                    status: "Ended",
                },
            });
            let Finalpayload = {
                price: 0,
                message: "Your Auction donot contain any hold payment. Contact to our team for more information.",
                auctionId: auction.id,
                receiverId: auction.CarSubmission.User.id,
                senderId: 6,
                userType: "buyer",
                regarding: "noHoldPayments",
                userName: auction.CarSubmission.User.name,
                receiverEmail: auction.CarSubmission.User.email,
                vehicleYear: auction.CarSubmission.vehicleYear,
                vehicleModel: auction.CarSubmission.vehicleModel,
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/notifications/notify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Finalpayload),
            })
            const data = await response.json();
            return NextResponse.json({ success: true, message: "Auction Ended" }, { status: 200 });
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
