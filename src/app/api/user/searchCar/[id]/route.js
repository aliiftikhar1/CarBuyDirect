import prisma from "@/lib/prisma";
import { select } from "jodit/esm/plugins/select/select";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const response = await prisma.Auction.findMany({
            include: {
                CarSubmission: {
                    select: {
                        id: true,
                        condition: true,
                        vehicleModel: true,
                        vehicleMake: true,
                        vehicleYear: true,
                        webSlug: true,
                    }
                },
              
            Seller: {
                select: {
                    name: true
                }
            },
        }
        })
    return NextResponse.json({ success: true, message: "Auctions Fetched Successfully!!", data: response }, { status: 200 })

} catch (error) {
    return NextResponse.json({ success: false, message: "Error occur while fetching auctions" }, { status: 500 })
}
}