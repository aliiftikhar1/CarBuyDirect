import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request, { params }) {
  try {
    const slide = await prisma.slide.findUnique({
      where: { id: params.id },
    })
    if (!slide) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 })
    }
    return NextResponse.json(slide)
  } catch (error) {
    console.error("Failed to fetch slide:", error)
    return NextResponse.json({ error: "Failed to fetch slide" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json()
    const updatedSlide = await prisma.slide.update({
      where: { id: params.id },
      data: {
        year: Number.parseInt(data.year),
        model: data.model,
        make: data.make,
        image: data.image,
        link: data.link,
      },
    })
    return NextResponse.json(updatedSlide)
  } catch (error) {
    console.error("Failed to update slide:", error)
    return NextResponse.json({ error: "Failed to update slide" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.slide.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ message: "Slide deleted successfully" })
  } catch (error) {
    console.error("Failed to delete slide:", error)
    return NextResponse.json({ error: "Failed to delete slide" }, { status: 500 })
  }
}

