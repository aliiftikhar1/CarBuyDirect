import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const slides = await prisma.slide.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json(slides)
  } catch (error) {
    console.error("Failed to fetch slides:", error)
    return NextResponse.json({ error: "Failed to fetch slides" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const newSlide = await prisma.slide.create({
      data: {
        year: Number.parseInt(data.year),
        model: data.model,
        make: data.make,
        image: data.image,
        link: data.link,
      },
    })
    return NextResponse.json(newSlide, { status: 201 })
  } catch (error) {
    console.error("Failed to create slide:", error)
    return NextResponse.json({ error: "Failed to create slide" }, { status: 500 })
  }
}

