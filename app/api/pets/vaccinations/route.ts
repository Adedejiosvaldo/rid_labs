import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/auth";
import prisma from "@/prisma/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const petOwner = await prisma.petOwner.findUnique({
      where: { email: session.user.email as string },
      include: {
        pets: {
          include: {
            vaccinations: true,
          },
        },
      },
    });

    if (!petOwner) {
      return NextResponse.json(
        { error: "Pet owner not found" },
        { status: 404 }
      );
    }

    const vaccinations = petOwner.pets.flatMap((pet) =>
      pet.vaccinations.map((vac) => ({
        id: vac.id,
        name: vac.name,
        date: vac.date,
        petName: pet.name,
      }))
    );

    return NextResponse.json(vaccinations);
  } catch (error) {
    console.error("Failed to fetch vaccinations:", error);
    return NextResponse.json(
      { error: "Failed to fetch vaccinations" },
      { status: 500 }
    );
  }
}
