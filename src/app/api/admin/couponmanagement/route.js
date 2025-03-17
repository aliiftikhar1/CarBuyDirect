import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const coupons = await prisma.coupons.findMany();
    return NextResponse.json({ data: coupons });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const coupon = await prisma.coupons.create({
      data: {
        title: body.title,
        discount: parseInt(body.discount),
        code: body.code,
        expiry: new Date(body.expiry),
      },
    });
    return NextResponse.json({ data: coupon });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
  }
}

