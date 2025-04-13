import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

export async function POST(request) {
  const data = await request.json();
  console.log("DATA FROM UPDATE USER", data);

  try {
    let hashedPassword;

    // Hash password if provided
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: data.id },
      data: {
        name: data.name || undefined,
        image: data.image || undefined,
        bio: data.bio || undefined,
        address: data.address || undefined,
        phoneNo: data.phoneNo || undefined,
        city: data.city || undefined,
        country: data.country || undefined,
        province: data.province || undefined,
        zipcode: data.zipcode || undefined,
        password: hashedPassword || undefined,
        username: data.username || undefined,
        cardName: data.cardName || undefined,
        cardNumber: data.cardNumber || undefined,
        cardExpiry: data.cardExpiry || undefined,
        cardCvc: data.cardCvc || undefined,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(
      { status: true, user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("ERROR FROM UPDATE USER", error.message);

    return NextResponse.json(
      { status: false, message: "Failed to update user", error: error.message },
      { status: 500 }
    );
  }
}
