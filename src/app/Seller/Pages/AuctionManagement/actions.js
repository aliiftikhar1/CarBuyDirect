"use server"

import prisma from "@/lib/prisma"

export async function createAuction(formData) {
  const { carSubmissionId, startDate, endDate, location, status,featured } = formData

  try {
    const carSubmission = await prisma.carSubmission.findUnique({
      where: { id: Number.parseInt(carSubmissionId) },
      include: { User: true },
    })

    if (!carSubmission) {
      throw new Error("Car submission not found")
    }

    const newAuction = await prisma.auction.create({
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        carId: carSubmission.id,
        sellerId: carSubmission.User.id,
        location,
        status,
        closingPrice: "0",
        featured:featured==='true'?true:false,
      },
    })

    // Update the car submission status
    await prisma.carSubmission.update({
      where: { id: carSubmission.id },
      data: { status: "in_auction" },
    })

    return { success: true, auction: newAuction }
  } catch (error) {
    console.error("Failed to create auction:", error)
    return { success: false, error: error.message }
  }
}

export async function getBiddingsForAuction(auctionId) {
  try {
    const biddings = await prisma.bidding.findMany({
      where: { auctionId },
      include: {
        User: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return biddings
  } catch (error) {
    console.error("Failed to fetch biddings:", error)
    return []
  }
}

export async function getAuctions() {
  try {
    const response = await fetch(`/api/admin/auctionmanagement`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch auctions");
    }

    const data = await response.json();
    // console.log("Data",data)
    return data.data; // Ensure your API returns data in this structure.
  } catch (error) {
    console.error("Error fetching auctions:", error);
    return [];
  }
}

export async function getCarSubmissions() {
  try {
    const response = await fetch(`/api/admin/approvedcarsubmissions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch auctions");
    }

    const data = await response.json();
    // console.log("Data",data)
    return data.data; // Ensure your API returns data in this structure.

  } catch (error) {
    console.error("Error fetching auctions:", error);
    return [];
  }
}

export async function updateAuction(data) {
  try {
    const updatedAuction = await prisma.auction.update({
      where: { id: data.id },
      data: {
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        location: data.location,
        status: data.status,
        featured:data.featured==='true'?true:false,
      },
      include: {
        CarSubmission: {
          include: {
            User:true,
            SubmissionImages: true,
            Brand: true
          }
        },
        Seller: {},
        Bids: {
          orderBy: {
            createdAt: "desc",
          },
        },
        Watching: true
      }
    })
    return { success: true, data: updatedAuction }
  } catch (error) {
    console.error("Error updating auction:", error)
    return { success: false, error: "Failed to update auction" }
  }
}
