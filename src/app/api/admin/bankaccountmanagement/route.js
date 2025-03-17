import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';


export async function POST(request) {
    try {
        const data = await request.json(); 
        console.log("Payload is", data);

        const newAccount = await prisma.BankAccount.create({
            data:{
                title: data.title,
                bank_name: data.bank_name,
                account_number: data.account_number,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Bank Account created successfully",
            data: newAccount,
        });
    } catch (e) {
        console.error("Error is", e);
        return NextResponse.json({
            success: false,
            message: "Failed to create bank account",
            error: e.message,
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const data = await prisma.BankAccount.findMany();
        return NextResponse.json({
            success: true,
            data,
        });
    } catch (e) {
        return NextResponse.json({
            success: false,
            message: "Failed to fetch Bank Account",
            error: e.message,
        }, { status: 500 });
    }
}
