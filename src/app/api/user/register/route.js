import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        const data = await request.json();
        console.log("Payload is", data);
        // ✅ Stripe Customer ID create karo
        const customer = await stripe.customers.create({
            email: data.email,
            name: data.name,
        });

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const newUser = await prisma.User.create({
            data: {
                name: data.name,
                email: data.email,
                type: 'customer',
                password: hashedPassword,
                address: data.address,
                status: 'active',
                verified: data.verified === 'on' ? true : false,
                phoneNo: data.phoneNo || '03000000000',
                stripeCustomerId: customer.id
            },
        });
        // // ✅ Stripe Customer ID create karo
        // const customer = await stripe.customers.create({
        //     email: data.email,
        //     name: data.name,
        // });
        // // ✅ Ab user table me Stripe Customer ID update karo
        // const updatedUser = await prisma.user.update({
        //     where: { id: newUser.id },
        //     data: {stripeCustomerId: customer.id}
        // });
        console.log("USER DATA DURING REGISTRATION", newUser)
        return NextResponse.json({
            success: true,
            message: "User created successfully",
            data: newUser,
        });
    } catch (e) {
        console.error("Error is", e);
        return NextResponse.json({
            success: false,
            message: "Failed to create user",
            error: e.message,
        }, { status: 500 });
    }
}
