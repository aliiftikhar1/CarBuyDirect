import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export async function GET(request) {
  try {
    const products = await prisma.car.findMany({
      include: {
        Brand: true,
        Images: true,
        // ProductImages: true,
      },
    });
    return NextResponse.json({ data: products }, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    console.log("Payload is", data);
    const {
      name,
  description,
  highlights,
  specs,
  chasisNo,
  exterior,
  interior,
  lotNo,
  location,
  mileage,
  orientation,
  status,
  brandId,
  sellerId,
  images
    } = data;

    const product = await prisma.car.create({
      data: {
        name,
        description,
        highlights,
        specs,
        chasisNo,
        exterior,
        interior,
        lotNo,
        location,
        mileage,
        orientation,
        status,
        brandId: parseInt(brandId),
        sellerId : 1,
      },
    });

    console.log("Car is created successfully with id",product.id)
    if (images && images.length > 0) {
      for (const img of images) {
        await prisma.carImage.create({
          data: {
            carId: product.id,
            url: img.url,
            type: img.type,
          },
        });
      }
    }
    

    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Error creating product' }, { status: 500 });
  }
}

