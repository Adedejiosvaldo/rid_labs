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

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json();

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
        petId: id,
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
