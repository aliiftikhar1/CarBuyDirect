import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET(_, { params }) {
  try {
    const { id } = params;
    const autobid = await prisma.autobid.findUnique({ where: { id: Number(id) } });

    if (!autobid) return NextResponse.json({ error: "Autobid not found" }, { status: 404 });

    return NextResponse.json(autobid, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching autobid" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const data = await req.json();
    const updatedAutobid = await prisma.autobid.update({ where: { id: Number(id) }, data });

    return NextResponse.json(updatedAutobid, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error updating autobid" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
    try {
      const { id } = params
      const { maxAmount, incrementAmount, status } = await req.json()
  
      // Validate the autobid exists
      const existingAutobid = await prisma.autobid.findUnique({
        where: { id: parseInt(id) },
      })
  
      if (!existingAutobid) {
        return NextResponse.json({ error: "Autobid not found" }, { status: 404 })
      }
  
      // Update the autobid
      const updatedAutobid = await prisma.autobid.update({
        where: { id: parseInt(id) },
        data: {
          maxAmount,
          incrementAmount,
          status,
          updatedAt: new Date(), // Add updated timestamp
        },
      })
  
      return NextResponse.json(updatedAutobid, { status: 200 })
    } catch (error) {
      console.error("Error updating autobid:", error)
      return NextResponse.json({ error: "Error updating autobid" }, { status: 500 })
    }
  }

export async function DELETE(_, { params }) {
  try {
    const { id } = params;
    await prisma.autobid.delete({ where: { id: Number(id) } });

    return NextResponse.json({ message: "Autobid deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting autobid" }, { status: 500 });
  }
}
