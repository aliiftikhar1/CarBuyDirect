import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET() {
  try {
    const autobids = await prisma.autobid.findMany();
    return NextResponse.json(autobids, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching autobids" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userId, auctionId, maxAmount, incrementAmount, status } = await req.json();
    const newAutobid = await prisma.autobid.create({
      data: { userId, auctionId, maxAmount, incrementAmount, status },
    });
    return NextResponse.json(newAutobid, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error creating autobid" }, { status: 500 });
  }
}
