import nodemailer from "nodemailer";

export async function sendDeclineNotificationEmail(receiverEmail, buyerName, carDetails) {
    try {
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
            subject: "🎉 Deal Confirmed - Congratulations on Your Purchase!",
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <!-- Header -->
                <h2 style="color: #333; text-align: center;">🎉 Congratulations on Your New Car! 🚗</h2>
                <!-- Greeting -->
                <p>Hello <strong>${buyerName}</strong>,</p>
                <!-- Success Message -->
                <p>We are excited to inform you that your deal for the following car has been <strong>successfully completed!</strong></p>
        
                <!-- Car Details -->
                <div style="background-color: #f8f8f8; padding: 15px; border-radius: 8px;">
                    <p><strong>Final Price:</strong> ${carDetails.price} USD</p>
                </div>
        
                <!-- Next Steps -->
                <h3 style="margin-top: 20px;">📦 What's Next?</h3>
                <p>Your car purchase has been confirmed. You will receive further details regarding delivery and documentation soon.</p>
        
                <!-- Button to View Order -->
                <p style="text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/orders" 
                        style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">
                        View My Purchase
                    </a>
                </p>
        
                <!-- Support Message -->
                <p>If you have any questions or need assistance, feel free to <a href="${process.env.NEXT_PUBLIC_BASE_URL}/contact">contact us</a>.</p>
        
                <!-- Thank You -->
                <p>Thank you for choosing <strong>Car Store</strong>! 🎉</p>
        
                <p><strong>Car Store Team</strong></p>
            </div>
            `,
        };
        console.log("Deal notification email sent successfully.");
        // <p><strong>Car Model:</strong> ${carDetails.vehicleModel}</p>
        // <p><strong>Year:</strong> ${carDetails.vehicleYear}</p>
        return await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending deal notification email:", error);
        throw new Error("Failed to send deal notification email");
    }
}