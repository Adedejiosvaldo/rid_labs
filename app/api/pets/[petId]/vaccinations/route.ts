import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { petId: string } }
) {
  const petId = params.petId;

  try {
    const vaccinations = await prisma.vaccination.findMany({
      where: { petId: petId },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(vaccinations);
  } catch (error) {
    console.error("Failed to fetch vaccinations:", error);
    return NextResponse.json(
      { error: "Failed to fetch vaccinations" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { petId: string } }
) {
  const petId = parseInt(params.petId);
  const { vaccineName, dateAdministered, expirationDate } =
    await request.json();

  try {
    const newVaccination = await prisma.vaccination.create({
      data: {
        petId,
        vaccineName,
        dateAdministered: new Date(dateAdministered),
        expirationDate: new Date(expirationDate),
      },
    });

    return NextResponse.json(newVaccination, { status: 201 });
  } catch (error) {
    console.error("Failed to create vaccination record:", error);
    return NextResponse.json(
      { error: "Failed to create vaccination record" },
      { status: 500 }
    );
  }
}
