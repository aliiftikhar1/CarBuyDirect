import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_, { params }) {
  try {
    const { id } = params;
    const autobids = await prisma.autobid.findMany({ where: { auctionId: Number(id) } });

    return NextResponse.json(autobids, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching autobids for auction" }, { status: 500 });
  }
}
