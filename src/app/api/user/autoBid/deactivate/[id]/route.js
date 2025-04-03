import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
    try {
        const { id } = params; // Extract ID properly
        console.log("ID:", id);

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        // Validate the autobid exists
        const existingAutobid = await prisma.autobid.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingAutobid) {
            return NextResponse.json({ error: "Autobid not found" }, { status: 404 });
        }

        // Update the autobid
        const updatedAutobid = await prisma.autobid.update({
            where: { id: parseInt(id) },
            data: {
                status: "deactive",
                updatedAt: new Date(),
            },
        });

        return NextResponse.json(updatedAutobid, { status: 200 });
    } catch (error) {
        console.error("Error updating autobid:", error);
        return NextResponse.json({ error: "Error updating autobid" }, { status: 500 });
    }
}
