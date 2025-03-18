import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
    const id = params.id;
    const data = await request.json()
    console.log("Payload is : ",data)
    try {
        const auction = await prisma.auction.findUnique({
            where: {
                id: parseInt(id)
            },
            include:{
                HoldPayments:true,
                Bids:true,
            }
        })
        const amount = auction.Bids.slice().reverse()[0].price
        const holdpayment = auction.HoldPayments.find((data)=>data.userId==auction.Bids.slice().reverse()[0].userId)
            const response = await fetch('/api/stripe/capture-payment', {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentIntentId: holdpayment.paymentIntentId,
                userId: auction.Bids.slice().reverse()[0].userId,
                amount: amount,
                transferDescription: `The Payment of Auction ${auction.id} is successful!!`,
              }),
            });
          
           
        console.log(auction.id, amount, holdpayment)
        if (!auction ) {
            return NextResponse.error({
                status: 404,
                message: "Auction not found"
            })
        }
        if (auction.status === "Ended"||auction.status==='Sold') {
            return NextResponse.error({
                status: 400,
                message: "Auction already ended"
            })
        }
        if (auction) {
            const auction = await prisma.auction.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    status: "Sold"
                    // status: "Ended"
                }
            })

            const soldout = await prisma.Sold.create({
                data:{
                    auctionId: auction.id,
                    userId:data.userid,
                    price:data.price,
                    currency:data.currency,
                }
            })
        }
        return NextResponse.json({
            success: true,
            data: auction
        }, { status: 200 })

    } catch (error) {
        return NextResponse.error({

            status: 500,
            message: "Internal Server Error"
        })
    }

}