import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/sendVerificationEmail";
import crypto from "crypto";

export async function POST(request) {
  try {
    const { email } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: "Email not found" }, { status: 404 });
    }

    const token = crypto.randomBytes(32).toString("hex");

    
    await prisma.user.update({
      where: { email },
      data: { verificationToken: token, tokenExpiresAt: new Date(Date.now() + 3600000) }, 
    });

    
    await sendVerificationEmail(email, token);

    return NextResponse.json({ message: "Verification email sent" }, { status: 200 });

  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
