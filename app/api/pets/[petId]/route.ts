import prisma from "@/prisma/db";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

export async function GET(
  request: Request,
  { params }: { params: { petId: string } }
) {
  const petId = params.petId;

  try {
    const pet = await prisma.pet.findUnique({
      where: {
        id: petId,
      },
      include: {
        vaccinations: true,
      },
    });

    if (!pet) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...pet,
      nextVaccination: pet.vaccinations[0]?.date.toISOString() || null,
    });
  } catch (error) {
    console.error("Error fetching pet:", error);
    return NextResponse.json(
      { error: "Failed to fetch pet details" },
      { status: 500 }
    );
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// export async function PUT(
//   request: Request,
//   { params }: { params: { petId: string } }
// ) {
//   const petId = params.petId;
//   const formData = await request.formData();

//   const name = formData.get("name") as string;
//   const age = parseInt(formData.get("age") as string);
//   const description = formData.get("description") as string;
//   const imageFile = formData.get("image") as File | null;

//   let imageUrl;
//   if (imageFile) {
//     const bytes = await imageFile.arrayBuffer();
//     const buffer = Buffer.from(bytes);
//     const filename = `${Date.now()}-${imageFile.name}`;
//     const filepath = path.join(process.cwd(), "public", "uploads", filename);
//     await writeFile(filepath, buffer);
//     imageUrl = `/uploads/${filename}`;
//   }

//   try {
//     const updatedPet = await prisma.pet.update({
//       where: { id: petId },
//       data: {
//         name,
//         age,
//         ...(imageUrl && { imageUrl }),
//       },
//     });

//     return NextResponse.json(updatedPet);
//   } catch (error) {
//     console.error("Error updating pet:", error);
//     return NextResponse.json(
//       { error: "Failed to update pet details" },
//       { status: 500 }
//     );
//   }
// }

export async function PATCH(
  request: Request,
  { params }: { params: { petId: string } }
) {
  const petId = params.petId;
  const formData = await request.formData();

  const updateData: any = {};

  // Only include fields that were actually updated
  ["name", "age", "description"].forEach((field) => {
    const value = formData.get(field);
    if (value !== null) {
      updateData[field] = field === "age" ? parseInt(value as string) : value;
    }
  });

  const imageFile = formData.get("image") as File | null;

  if (imageFile) {
    try {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "auto" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });
      updateData.imageUrl = (result as any).secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }
  }

  try {
    const updatedPet = await prisma.pet.update({
      where: { id: petId },
      data: updateData,
    });

    return NextResponse.json(updatedPet);
  } catch (error) {
    console.error("Error updating pet:", error);
    return NextResponse.json(
      { error: "Failed to update pet details" },
      { status: 500 }
    );
  }
}
