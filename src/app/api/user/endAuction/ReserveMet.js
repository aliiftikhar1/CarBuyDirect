import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Stripe from "stripe"
import { sendReserveMetEmail } from "@/lib/ReserveMetEmail";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function ReserveMet({ latestBid, auction }) {

  //Payment Capture / Release Logic implemented
  const allauctionholdpayments = auction.HoldPayments.filter(payment => payment.userId !== latestBid.userId);
  const holdPayment = auction.HoldPayments.filter(payment => payment.userId == latestBid.userId)[auction.HoldPayments.filter(payment => payment.userId == latestBid.userId).length - 1];
  console.log("Hold Payment is :", holdPayment);
  console.log("All Auction Hold Payments are :", allauctionholdpayments);
  // return NextResponse.json({ success: true, data: "Hold payment checking" }, { status: 200 });
  if (!holdPayment) {
    return NextResponse.json({ success: false, message: "Hold payment not found" }, { status: 400 });
  } else {
    //Capture Top bidder payment
    if(holdPayment.paymentIntentId && holdPayment.status!=="require-capture"){
    const capturePaymentIntent = await stripe.paymentIntents.capture(holdPayment.paymentIntentId)
    await prisma.HoldPayments.update({
      data: {
        status: "captured"
      },
      where: {
        paymentIntentId: holdPayment.paymentIntentId
      }
    }).catch((err) => {
      console.log("Hold Payment updation failed!")
    })
  }
  else{
    
  return NextResponse.json({ success: false, message: "Payment is already captured" }, { status: 400 });
  }
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

  //notification to seller to inform about end of auction and reserve has been met
  let Finalpayload = {
    price: latestBid.price,
    message: "Reserve Met. Waiting for buyer to complete the payment.",
    auctionId: auction.id,
    receiverId: auction.CarSubmission.User.id,
    senderId: latestBid.userId,
    userType: "buyer",
    regarding: "reserve-met",
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

  //sending notification to sender to inform that the reserve has been met and to proceed to payment
  let Finalpayload2 = {
    price: latestBid.price,
    message: "Reserve Met. You are the top bidder of the auction. Please complete the payment to buy the vehicle.",
    auctionId: auction.id,
    receiverId: auction.CarSubmission.User.id,
    senderId: latestBid.userId,
    userType: "seller",
    regarding: "reserve-met",
    userName: auction.CarSubmission.User.name,
    receiverEmail: auction.CarSubmission.User.email,
    vehicleYear: auction.CarSubmission.vehicleYear,
    vehicleModel: auction.CarSubmission.vehicleModel,
  }
  const response2 = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/notifications/notify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Finalpayload2),
  })
  const data2 = await response2.json();
  await sendReserveMetEmail(latestBid.User.email, auction);

  await prisma.Auction.update({
    where: { id: auction.id },
    data: {
      status: "Ended",
    },
  });

  return NextResponse.json({ success: true, message: "Reserve Met" }, { status: 200 });
}