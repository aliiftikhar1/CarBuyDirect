import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        const { id } = params;

        const bid = await prisma.bidding.findMany({
            where: {
                userId: parseInt(id),
            },
            include: {Auction:true,
                User:true,
                CarSubmission: {
                    select: {
                        vehicleModel: true,
                        vehicleMake: true,
                        vehicleYear: true,
                        SubmissionImages: {
                            where: {
                                label: "horizontal",
                            },
                            select: {
                                name: true,
                                data: true,
                            },
                        },
                    },
                },
            },
        });

        if (!bid || bid.length === 0) {
            return NextResponse.json(
                { success: false, message: "Bid not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, data: bid },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
