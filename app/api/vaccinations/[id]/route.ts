import { NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/auth";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "doctor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const { status, notes, nextDate, imageUrl } = await request.json();

  try {
    const updatedVaccination = await prisma.vaccination.update({
      where: { id },
      data: {
        status,
        notes,
        nextDate: nextDate ? new Date(nextDate) : null,
        imageUrl,
      },
    });
    // If a next date is provided, create a new upcoming vaccination
    if (nextDate) {
      const nextVaccination = await prisma.vaccination.create({
        data: {
          petId: updatedVaccination.petId,
          name: updatedVaccination.name,
          date: new Date(nextDate),
          status: "upcoming",
          imageUrl: "",
          notes: "",
        },
      });
    }

    return NextResponse.json(updatedVaccination);
  } catch (error) {
    console.error("Failed to update vaccination:", error);
    return NextResponse.json(
      { error: "Failed to update vaccination" },
      { status: 500 }
    );
  }
}
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "doctor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  try {
    const vaccination = await prisma.vaccination.findUnique({
      where: { id },
      include: {
        pet: {
          include: {
            owner: true,
          },
        },
      },
    });

    if (!vaccination) {
      return NextResponse.json(
        { error: "Vaccination not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(vaccination);
  } catch (error) {
    console.error("Failed to fetch vaccination:", error);
    return NextResponse.json(
      { error: "Failed to fetch vaccination" },
      { status: 500 }
    );
  }
}
