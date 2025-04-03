import { NextResponse } from "next/server"
import prisma from "@/lib/prisma" // Assuming you have a Prisma client setup

export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, zipcode, location } = body

    // Validate required fields
    if (!userId || !zipcode || !location) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      include: { serviceProvider: true },
    })

    if (!userExists) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Check if user is already a service provider
    if (userExists.serviceProvider) {
      return NextResponse.json({ message: "User is already a service provider" }, { status: 400 })
    }

    // Create service provider
    const serviceProvider = await prisma.serviceProvider.create({
      data: {
        userId,
        zipcode,
        location,
      },
    })

    return NextResponse.json({ message: "Service provider created successfully", serviceProvider }, { status: 201 })
  } catch (error) {
    console.error("Error creating service provider:", error)
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const serviceProviders = await prisma.serviceProvider.findMany({
      include: {
        user: true,
      },
    })

    return NextResponse.json(serviceProviders)
  } catch (error) {
    console.error("Error fetching service providers:", error)
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 })
  }
}

