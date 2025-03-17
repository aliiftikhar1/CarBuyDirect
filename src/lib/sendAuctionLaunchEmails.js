import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function sendAuctionLaunchEmails(auctionDetails) {
    try {
        // 🔹 Fetch all user emails from Prisma
        const users = await prisma.user.findMany({ select: { email: true } });
        const userEmails = users.map(user => user.email);
        console.log("users", users)
        if (!userEmails.length) {
            throw new Error("No users found to send emails.");
        }

        const { startDate, endDate, location, closingPrice } = auctionDetails;

        // 🔹 Format dates properly
        const formattedStartDate = new Date(startDate).toLocaleString();
        const formattedEndDate = new Date(endDate).toLocaleString();

        // 🔹 SMTP Transporter setup
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USERNAME, // Gmail address
                pass: process.env.EMAIL_PASSWORD, // App password
            },
        });

        // 🔹 Email content
        const mailOptions = (email) => ({
            from: `"Car Buy Direct Auctions" <${process.env.EMAIL_USERNAME}>`,
            to: email,
            subject: "🚗 A New Auction is Now Live! Bid Now!",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
          <h2 style="color: #ff6600; text-align: center;">🚀 A New Auction Has Launched!</h2>
          <p style="font-size: 16px; color: #333; text-align: center;">
            Be part of the action! Our latest car auction has just gone live. Don’t miss out on the chance to bid on your dream car!
          </p>
          
          <div style="background: #f4f4f4; padding: 15px; border-radius: 10px; margin-top: 20px;">
            <h3 style="text-align: center; color: #333;">🏁 Auction Details</h3>
            <ul style="list-style: none; padding: 0; font-size: 16px;">
              <li><strong>📅 Start Date:</strong> ${formattedStartDate}</li>
              <li><strong>⏳ End Date:</strong> ${formattedEndDate}</li>
              <li><strong>📍 Location:</strong> ${location}</li>
              <li><strong>💰 Starting Price:</strong> $${closingPrice}</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/auction" 
               style="background: #ff6600; color: #fff; padding: 12px 25px; text-decoration: none; font-size: 18px; font-weight: bold; border-radius: 5px; display: inline-block;">
               🔥 Join the Auction Now
            </a>
          </div>

          <p style="font-size: 14px; color: #666; text-align: center; margin-top: 20px;">
            Hurry up! The auction will end soon. Get your bid in before it’s too late!
          </p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 14px; color: #888; text-align: center;">
            <strong>Car Buy Direct Team</strong><br>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="color: #ff6600; text-decoration: none;">Visit Our Website</a>
          </p>
        </div>
      `,
        });

        // 🔹 Loop through each user and send email
        const sendEmails = userEmails.map((email) =>
            transporter.sendMail(mailOptions(email))
        );

        await Promise.all(sendEmails);

        console.log(`Emails sent successfully to ${userEmails.length} users.`);
        return { success: true, message: "Auction emails sent to all users" };

    } catch (error) {
        console.error("Error sending auction emails:", error);
        return { success: false, message: "Failed to send auction emails" };
    }
}
