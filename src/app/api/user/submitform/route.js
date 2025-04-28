import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const MAX_RETRIES = 3; // Number of retries for failed image uploads

// Function to slugify a string
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Trim hyphens from start and end
};

// Function to generate a unique slug
const generateUniqueSlug = async (year, make, model) => {
  // Combine year, make, and model
  const baseString = `${year}-${make}-${model}`;
  let slug = slugify(baseString);
  let uniqueSlug = slug;
  let counter = 1;

  // Check for existing slugs
  while (await prisma.carSubmission.findFirst({ where: { webSlug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
};

export async function POST(request) {
  try {
    const data = await request.json();
    console.log("Payload is:", data);

    const {
      firstName,
      lastName,
      email,
      phone,
      vehicleMake,
      vehicleModel,
      vehicleYear,
      vin,
      mileage,
      mileageUnit,
      price,
      currency,
      country,
      postal,
      notes,
      description,
      highlights,
      specs,
      category,
      bodyType,
      transmission,
      engineCapacity,
      fuelType,
      exteriorColor,
      condition,
      reserved,
      reservedPrice,
      buyPrice,
      buy,
      score,
      owners,
      acdnt,
      titles,
      odo,
      sellerId,
      files,
      report_pdf,
    } = data;

    // Generate unique webSlug
    const webSlug = await generateUniqueSlug(vehicleYear, vehicleMake, vehicleModel);

    // Create Car Submission
    const carsubmission = await prisma.carSubmission.create({
      data: {
        firstname: firstName,
        lastname: lastName,
        email,
        phone,
        vehicleMake,
        vehicleModel,
        vehicleYear,
        vin,
        mileage,
        mileageUnit,
        price,
        currency,
        country,
        postal,
        description,
        highlights,
        specs: specs || null,
        notes,
        category,
        bodyType,
        transmission,
        engineCapacity,
        fuelType,
        exteriorColor,
        condition,
        status: "Pending",
        sellerId: parseInt(sellerId) || 1,
        reserved: reserved === "True" ? true : false,
        reservedPrice: reservedPrice ? parseInt(reservedPrice) : null,
        buy: buy === "True" ? true : false,
        buyPrice: buyPrice ? parseInt(buyPrice) : null,
        webSlug,
        score: parseInt(score) || 0,
        owners: parseInt(owners) || 1,
        acdnt: parseInt(acdnt) || 0,
        titles: titles === true || titles === "true",
        odo: odo === true || odo === "true",
        pdfUrl: report_pdf || null,
      },
    });

    // Function to upload images with retries
    const uploadImageWithRetry = async (image, submissionId, attempt = 1) => {
      try {
        // Validate required image fields
        if (!image.url || !image.name || !image.type || !image.size) {
          console.warn(`Skipping invalid image: ${JSON.stringify(image)}`);
          return;
        }

        await prisma.carSubmissionImage.create({
          data: {
            submissionId,
            name: image.name,
            type: image.type,
            size: parseInt(image.size),
            data: image.url,
          },
        });
        console.log(`Successfully uploaded image: ${image.name}`);
      } catch (error) {
        if (attempt < MAX_RETRIES) {
          console.warn(
            `Retrying image upload for ${image.name} (Attempt ${
              attempt + 1
            }/${MAX_RETRIES})`
          );
          await uploadImageWithRetry(image, submissionId, attempt + 1);
        } else {
          console.error(
            `Failed to upload image ${image.name} after ${MAX_RETRIES} retries:`,
            error
          );
          throw error;
        }
      }
    };

    // Process image files
    if (files && Array.isArray(files) && files.length > 0) {
      for (const img of files) {
        if (img && img.url) {
          await uploadImageWithRetry(img, carsubmission.id);
        } else {
          console.warn(`Skipping invalid or missing image: ${JSON.stringify(img)}`);
        }
      }
    } else {
      console.log("No images provided in the payload.");
    }

    return NextResponse.json({
      success: true,
      message: "Car submission created successfully.",
      submissionId: carsubmission.id,
      webSlug,
    });
  } catch (error) {
    console.error("Error processing car submission:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}