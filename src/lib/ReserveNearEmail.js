import nodemailer from "nodemailer";

export async function sendReserveNearEmail(latestBid,receiverEmail, carDetails) {
    try {
        console.log(carDetails.vehicleYear)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USERNAME, // Gmail username
                pass: process.env.EMAIL_PASSWORD, // Gmail app password
            },
        });

        const mailOptions = {
            from: `"Car Store" <${process.env.EMAIL_USERNAME}>`,
            // to: 'suffiyanahmed804092@gmail.com',
            to: receiverEmail,
            subject: "Reserve Near Notification - Car Store",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">🚗 New Car Deal Received!</h2>
          <p>Hello,</p>
          <p>Auction has been ended and you are the top bidder on this auction, whose details are:</p>
          
          <div style="background-color: #f8f8f8; padding: 15px; border-radius: 8px;">
            <p><strong>Car Model:</strong> ${carDetails.vehicleModel}</p>
            <p><strong>Year:</strong> ${carDetails.vehicleYear}</p>
            <p><strong>Top Bid:</strong> ${latestBid.price}</p>
          </div>

          <h3 style="margin-top: 20px;">📩 Message from Buyer:</h3>
          <p style="background-color: #fff3cd; padding: 10px; border-radius: 8px; font-style: italic;">
            "Go to wwww.carbuydirect.com and complete the payment so that this car can be yours."
          </p>

          <p>To view or respond to this deal, click the button below:</p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/deals" 
             style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px;">
            View Deal
          </a>

          <p>Thank you,<br><strong>Car Store Team</strong></p>
        </div>
      `,
        };

        console.log("Deal notification email sent successfully.");
        return await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending deal notification email:", error);
        throw new Error("Failed to send deal notification email");
    }
}
