import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function ReserveNear({latestBid, auction}) {

    //Payment Capture / Release Logic implemented
    const allauctionholdpayments = auction.HoldPayments.filter(payment => payment.userId !== latestBid.userId);
    const holdPayment = auction.HoldPayments.find(payment => payment.userId == latestBid.userId);
    console.log("Hold Payment is :", holdPayment);
    console.log("All Auction Hold Payments are :", allauctionholdpayments);
    // return NextResponse.json({ success: true, data: "Hold payment checking" }, { status: 200 });
        if (!holdPayment) {
            return NextResponse.json({ success: false, message: "Hold payment not found" }, { status: 400 });
        }else{
            //Donot Capture / Release Top bidder payment
        // const capturePaymentIntent = await stripe.paymentIntents.capture(holdPayment.paymentIntentId)
        // await prisma.HoldPayments.update({
        //     data: {
        //       status: "captured"
        //     },
        //     where: {
        //       paymentIntentId: holdPayment.paymentIntentId
        //     }
        //   }).catch((err) => {
        //     console.log("Hold Payment updation failed!")
        //   })
        // release holded payment to other bidders
        const cancelOptions = {
            cancellation_reason: "requested_by_customer",
          }
          if (allauctionholdpayments) {
            for (let i = 0; i < allauctionholdpayments.length; i++) {
              if (allauctionholdpayments[i].status === "requires_capture") {
                const canceledPaymentIntent = await stripe.paymentIntents.cancel(allauctionholdpayments[i].paymentIntentId, cancelOptions)
                await prisma.HoldPayments.update({
                  data: {
                    status: "released"
                  },
                  where: {
                    paymentIntentId: allauctionholdpayments[i].paymentIntentId
                  }
                }).catch((err) => {
                  console.log("Hold Payment updation failed!")
                })
              }
            }
          }
        }
    let Finalpayload = {
        price: latestBid.price,
        message: "Top bidder of the auction has reached near the reserve price. Do you want to sell the vehicle on mentioned price or do you want to negotiate with buyer?",
        auctionId: auction.id,
        receiverId: auction.CarSubmission.User.id,
        senderId: latestBid.userId,
        userType: "buyer",
        regarding: "reserve-near",
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