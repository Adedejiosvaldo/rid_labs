import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust the import based on your auth configuration

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const session = await getServerSession(authOptions); // Get the session
  const { name, species, breed, age } = await request.json();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if the user role is 'user'
  if (session.user.role !== "user") {
    return NextResponse.json(
      { error: "Forbidden: Only users can create pets" },
      { status: 403 }
    );
  }

  const ownerId = session.user.id; // Assuming the user ID is stored in the session

  try {
    const newPet = await prisma.pet.create({
      data: {
        name,
        species,
        breed,
        age,
        owner: {
          connect: { id: ownerId }, // Connect to the PetOwner by ID
        },
      },
    });

    return NextResponse.json(newPet, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create pet" },
      { status: 500 }
    );
  }
}
