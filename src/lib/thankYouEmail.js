import nodemailer from "nodemailer";

export async function sendThankEmail(email) {
  try {
    // SMTP Transporter setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME, // Gmail address
        pass: process.env.EMAIL_PASSWORD, // App password (NOT your Gmail password)
      },
    });

    // Email content
    const mailOptions = {
      from: `"Car Buy Direct" <${process.env.EMAIL_USERNAME}>`, // Sender Name
      to: email,
      subject: "Thank You for Registering!",
      html: `
        <h2>Thank You for Joining Car Buy Direct!</h2>
        <p>We appreciate your interest. Stay tuned for amazing offers and updates.</p>
        <p>Visit our website: <a href="${process.env.NEXT_PUBLIC_BASE_URL}">${process.env.NEXT_PUBLIC_BASE_URL}</a></p>
        <p>Best regards,</p>
        <p><strong>Car Buy Direct Team</strong></p>
      `,
    };

    // Send Email
    await transporter.sendMail(mailOptions);
    console.log("Thank you email sent successfully to:", email);
    return { success: true, message: "Email sent successfully" };

  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email" };
  }
}
