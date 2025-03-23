import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Stripe from "stripe"
import { sendReserveNotMetEmail } from "@/lib/ReserverNotMetEmail";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function ReserveNotMet({latestBid, auction}) {
    //Payment Release Logic implemented for all bidders 
    const allauctionholdpayments = auction.HoldPayments;
    console.log("All Auction Hold Payments are :", allauctionholdpayments);
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
    let Finalpayload = {
        price: latestBid.price,
        message: "Reserve has not met. We will reschedule the auction for you soon.",
        auctionId: auction.id,
        receiverId: auction.CarSubmission.User.id,
        senderId: latestBid.userId,
        userType: "buyer",
        regarding: "reserve-not-met",
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
    await sendReserveNotMetEmail(latestBid.User.email, auction.CarSubmission);
    
    console.log("Response:", data);
    console.log("FInal Payload:", Finalpayload);
    await prisma.Auction.update({
        where: { id: auction.id },
        data: {
            status: "Ended",
        },
    });
    return NextResponse.json({ success: false, message: "Reserve not met" }, { status: 400 });
}