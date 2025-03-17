import nodemailer from "nodemailer";

export async function sendMakeDealNotificationEmail(receiverEmail, senderName, carDetails, message) {
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
            subject: "New Deal Notification - Car Store",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">🚗 New Car Deal Received!</h2>
          <p>Hello,</p>
          <p><strong>${senderName}</strong> has sent you a deal for your car. Here are the details:</p>
          
          <div style="background-color: #f8f8f8; padding: 15px; border-radius: 8px;">
            <p><strong>Car Model:</strong> ${carDetails.vehicleModel}</p>
            <p><strong>Year:</strong> ${carDetails.vehicleYear}</p>
            <p><strong>Offered Price:</strong> ${carDetails.price} USD</p>
          </div>

          <h3 style="margin-top: 20px;">📩 Message from Buyer:</h3>
          <p style="background-color: #fff3cd; padding: 10px; border-radius: 8px; font-style: italic;">
            "${message}"
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
