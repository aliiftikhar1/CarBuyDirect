import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Route: /api/user/[id]
export async function GET(request, { params }) {
  const id = params.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        username: true,
        bio: true,
        address: true,
        city: true,
        country: true,
        province: true,
        zipcode: true,
        cardName: true,
        type: true,
        status: true,
        pricePlan: true,
        pricePlanEndDate: true,
        businessType: true,
        stripeCustomerId: true,
        verified: true,
        phoneNo: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User does not exist" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    console.error("Error is", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
