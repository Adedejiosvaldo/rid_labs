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
        records: true,
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

export async function PATCH(
  request: Request,
  { params }: { params: { petId: string } }
) {
  const petId = params.petId;
  const body = await request.json();

  const updateData: any = {};

  // Only include fields that were actually updated
  ["name", "description", "imageUrl"].forEach((field) => {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  });

  try {
    const updatedPet = await prisma.pet.update({
      where: { id: petId },
      data: updateData,
      include: {
        vaccinations: true,
      },
    });

    return NextResponse.json({
      ...updatedPet,
      nextVaccination: updatedPet.vaccinations[0]?.date.toISOString() || null,
    });
  } catch (error) {
    console.error("Error updating pet:", error);
    return NextResponse.json(
      { error: "Failed to update pet details" },
      { status: 500 }
    );
  }
}
