import { NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "doctor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const vaccinations = await prisma.vaccination.findMany({
      include: {
        pet: {
          include: {
            owner: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
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

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "doctor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { petId, name, date, status, notes, nextDate } = await request.json();

    const newVaccination = await prisma.vaccination.create({
      data: {
        petId,
        name,
        date: new Date(date),
        status: status || "upcoming",
        notes,
        nextDate: nextDate ? new Date(nextDate) : null,
      },
    });

    return NextResponse.json(newVaccination, { status: 201 });
  } catch (error) {
    console.error("Failed to create vaccination:", error);
    return NextResponse.json(
      { error: "Failed to create vaccination" },
      { status: 500 }
    );
  }
}