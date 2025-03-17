import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

export async function GET(request,{params}) {
    try {
        const { id } = await params;

        const deletedProduct = await prisma.Product.findUnique({
            where: { id: id },
        });

        return NextResponse.json({
            success: true,
            message: "Product Fetched successfully",
            data: deletedProduct,
        });
    } catch (e) {
        console.error("Error is", e);
        return NextResponse.json({
            success: false,
            message: "Failed to Fetch product",
            error: e.message,
        }, { status: 500 });
    }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = await request.json();
    console.log("Payload is", data);
    const {
      name,
      description,
      price,
      status,
      isfeatured,
      istoprated,
      istopselling,
      web_slug,
      meta_title,
      meta_description,
      meta_keywords,
      image,
      coverimage,
      isdiscounted,
      discount,
      product_id,
      subproduct_id,
      product_images,
    } = data;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price),
        status,
        isfeatured: Boolean(isfeatured),
        istoprated: Boolean(istoprated),
        istopselling: Boolean(istopselling),
        web_slug,
        meta_title,
        meta_description,
        meta_keywords,
        image,
        coverimage,
        isdiscounted,
        discount: parseInt(discount),
        product_id,
        subproduct_id,
      },
    });

    // Delete existing product images
    await prisma.productImages.deleteMany({
      where: { productid: id },
    });

    // Create new product images
    if (product_images && product_images.length > 0) {
      const newImages = product_images.filter((img) => !img.id);
      const existingImages = product_images.filter((img) => img.id);
    
      // Save new images
      if (newImages.length > 0) {
        await prisma.productImages.createMany({
          data: newImages.map((img) => ({
            productid: id,
            image: img.url, // 'url' instead of 'image' for new images
            type: img.type,
          })),
        });
      }
      if (existingImages.length > 0) {
        await prisma.productImages.createMany({
          data: existingImages.map((img) => ({
            productid: id,
            image: img.image, // 'url' instead of 'image' for new images
            type: img.type,
          })),
        });
      }
     
    }
    

    return NextResponse.json({ data: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Error updating product' }, { status: 500 });
  }
}


export async function DELETE(request,{params}) {
    try {
        const { id } = await params;

        const deletedProduct = await prisma.Car.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({
            success: true,
            message: "product deleted successfully",
            data: deletedProduct,
        });
    } catch (e) {
        console.error("Error is", e);
        return NextResponse.json({
            success: false,
            message: "Failed to delete product",
            error: e.message,
        }, { status: 500 });
    }
}
