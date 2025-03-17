import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure Prisma is properly set up

// ✅ GET: Fetch notification settings for a user
export async function GET(req, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const record = await prisma.emailsReceiverList.findUnique({
      where: { userId: parseInt(id) },
    });

    if (!record) {
      return NextResponse.json(
        { message: "No notification settings found", data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: record }, { status: 200 });
  } catch (error) {
    console.error("Error fetching notification setting:", error);
    return NextResponse.json(
      { error: "Failed to retrieve notification setting" },
      { status: 500 }
    );
  }
}

// ✅ POST: Update or create notification settings
export async function POST(req, { params }) {
  const { id } = params;
  const { getEmails } = await req.json(); // Expecting { getEmails: true/false }

  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const updatedRecord = await prisma.emailsReceiverList.upsert({
      where: { userId: parseInt(id) },
      update: { getEmails },
      create: { userId: parseInt(id), getEmails },
    });

    return NextResponse.json(
      { message: "Notification setting saved successfully", data: updatedRecord },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating/creating notification setting:", error);
    return NextResponse.json(
      { error: "Failed to save notification setting" },
      { status: 500 }
    );
  }
}
