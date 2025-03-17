import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    // Find the user with the given token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        tokenExpiresAt: { gt: new Date() }, // Ensure token is not expired
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    // Update user to mark as verified
    await prisma.user.update({
      where: { id: user.id },
      data: { verified: true, verificationToken: null, tokenExpiresAt: null },
    });

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
