import prisma from "@/lib/prisma";
import { sendDealDoneNotificationEmail } from "@/lib/sendDoneDealEmail";
import { NextResponse } from "next/server";
export async function POST(request) {
    try {
        const data = await request.json();
        const { price, auctionId,replyOf,userType, sellerId, userId, receiverEmail, userName, vehicleYear, vehicleModel, holdPayments } = data;
        console.log("Hold Payments are:", holdPayments);
        const userHoldPayment = holdPayments.find(payment => payment.userId == userId);
        console.log("User Hold Payment is :", userHoldPayment);
        if (!userHoldPayment) {
            return NextResponse.json({ success: false, message: "Hold payment not found" }, { status: 400 });
        }else{
            //Capture Top bidder payment
            const cancelOptions = {
                cancellation_reason: "requested_by_customer",
              }
        const capturePaymentIntent = await stripe.paymentIntents.cancel(userHoldPayment.paymentIntentId,cancelOptions)
        await prisma.HoldPayments.update({
            data: {
              status: "released"
            },
            where: {
              paymentIntentId: userHoldPayment.paymentIntentId
            }
          }).catch((err) => {
            console.log("Hold Payment updation failed!")
          })
        const carDetails = {
            vehicleYear, vehicleModel, price
        }
        // const sendEmail = await sendDealDoneNotificationEmail(receiverEmail, userName, carDetails)
        const resposne = await prisma.notification.create({
            data: {
                senderId: userId,  // Buyer ka ID
                receiverId: sellerId, // Seller ka ID
                auctionId,
                type: userType, // Change if needed
                message: "Offer has been declined",
                regarding:"decline",
                replyOf,
                price: parseFloat(price) || null, // Ensure price is Float
            },
        });

            return NextResponse.json({
                status: 200,
                success: true,
                message: "Notification sent successfully Via Email",
                resposne,
            });
        
    }
    } catch (error) {
        console.error("Error sending notification:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}