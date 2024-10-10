import { NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

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
    const pet = await prisma.pet.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            name: true,
            phoneNumber: true,
            email: true,
          },
        },
        vaccinations: {
          orderBy: {
            date: "desc",
          },
        },
        appointments: {
          orderBy: {
            date: "desc",
          },
          take: 5, // Get only the 5 most recent appointments
        },
      },
    });

    if (!pet) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 });
    }

    return NextResponse.json(pet);
  } catch (error) {
    console.error("Failed to fetch pet details:", error);
    return NextResponse.json(
      { error: "Failed to fetch pet details" },
      { status: 500 }
    );
  }
}
