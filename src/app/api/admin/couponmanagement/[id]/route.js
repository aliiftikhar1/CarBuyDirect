import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request,{ params}) {
    const id = params.id
  try {
    const body = await request.json();
    const coupon = await prisma.coupons.update({
      where: { id },
      data: {
        title: body.title,
        discount: parseInt(body.discount),
        code: body.code,
        expiry: new Date(body.expiry),
      },
    });
    return NextResponse.json({ data: coupon });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
    const id = params.id
  try {
    await prisma.coupons.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
  }
}

