import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { id } = params;

    try {
        const watching = await prisma.Watching.findMany({
            where: {
                userId: parseInt(id, 10), // Explicitly parse as an integer
            },
            include:{
                Auction:{
                    include:{
                        CarSubmission:{
                            select:{
                                vehicleModel:true,
                                vehicleMake:true,
                                vehicleYear:true,
                                SubmissionImages:{
                                    where:{
                                        label:"portrait"
                                    },
                                    select:{
                                        data:true
                                    }
                                }
                            }
                        }
                    }
             
                }
            }
        });

        if (!watching || watching.length === 0) {
            return NextResponse.json(
                { success: false, message: "Watching not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, data: watching },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}
