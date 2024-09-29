import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth";
import { CustomSession } from "@/types/custom";
import { createPetSchema } from "@/schemas/PetValidation";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const session = (await getServerSession(authOptions)) as CustomSession;
  //   const { name, species, breed, age } = await request.json();

  // In your POST handler
  const body = await request.json();
  const result = createPetSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.issues }, { status: 400 });
  }

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, species, breed, age } = result.data;

  // Check if the user role is 'user'
  if (session.user?.role !== "user") {
    return NextResponse.json(
      { error: "Forbidden: Only users can create pets" },
      { status: 403 }
    );
  }

  const ownerId = session.user?.id;

  try {
    const newPet = await prisma.pet.create({
      data: {
        name,
        species,
        breed: breed,
        age: age,
        owner: {
          connect: { id: ownerId },
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
