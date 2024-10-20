import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db"; // Adjust the import based on your project structure

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const records = await prisma.medicalRecord.findMany({
      where: { petId: id },
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching medical records:", error);
    return NextResponse.json(
      { error: "Failed to fetch medical records" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { petId } = body;
  console.log("Received ID:", petId); // Debugging line
  console.log("Request Body:", body); // Debugging line

  // Check if the ID is present
  if (!petId) {
    console.error("Error: Missing ID parameter");
    return NextResponse.json(
      { error: "Missing ID parameter" },
      { status: 400 }
    );
  }

  try {
    const newRecord = await prisma.medicalRecord.create({
      data: {
        history: body.history,
        clinicalParameters: body.clinicalParameters,
        diagnosis: body.diagnosis,
        treatment: body.treatment,
        recommendations: body.recommendations,
        nextAppointment: new Date(body.nextAppointment),
        signature: body.signature,
        petId: petId,
      },
    });
    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error("Error creating medical record:", error);
    return NextResponse.json(
      { error: "Failed to create medical record" },
      { status: 500 }
    );
  }
}
