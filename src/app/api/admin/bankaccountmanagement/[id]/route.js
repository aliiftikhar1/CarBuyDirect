import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

export async function GET(request,{params}) {
    try {
        const { id } = await params;

        const account = await prisma.BankAccount.findUnique({
            where: { id: id },
        });

        return NextResponse.json({
            success: true,
            message: "User Fetched successfully",
            data: account,
        });
    } catch (e) {
        console.error("Error is", e);
        return NextResponse.json({
            success: false,
            message: "Failed to Fetch Bank account",
            error: e.message,
        }, { status: 500 });
    }
}


export async function PUT(request,{params}) {
    try {
        const id = await params.id;
        const data = await request.json();
        console.log("Payload is : ",id,data);
        
        const updatedaccount = await prisma.BankAccount.update({
            where: { id: id },
            data:{
                title: data.title,
                bank_name: data.bank_name,
                account_number: data.account_number,
                updatedAt: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            message: "Bank Account updated successfully",
            data: updatedaccount,
        });
    } catch (e) {
        console.error("Error is", e);
        return NextResponse.json({
            success: false,
            message: "Failed to update account",
            error: e.message,
        }, { status: 500 });
    }
}

export async function DELETE(request,{params}) {
    try {
        const { id } = await params;

        const deletedBankAccount = await prisma.BankAccount.delete({
            where: { id: id },
        });

        return NextResponse.json({
            success: true,
            message: "BankAccount deleted successfully",
            data: deletedBankAccount,
        });
    } catch (e) {
        console.error("Error is", e);
        return NextResponse.json({
            success: false,
            message: "Failed to delete BankAccount",
            error: e.message,
        }, { status: 500 });
    }
}
