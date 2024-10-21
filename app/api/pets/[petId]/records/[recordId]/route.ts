import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db"; // Adjust the import based on your project structure

export async function GET(
  request: NextRequest,
  { params }: { params: { petId: string; recordId: string } }
) {
  const { petId, recordId } = params;

  try {
    const record = await prisma.medicalRecord.findUnique({
      where: {
        id: recordId, // Fetch the record by its ID
        petId: petId, // Ensure it belongs to the specified pet
      },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Medical record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error("Error fetching medical record:", error);
    return NextResponse.json(
      { error: "Failed to fetch medical record" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { petId: string; recordId: string } }
) {
  const { petId, recordId } = params;
  const data = await request.json();

  try {
    const updatedRecord = await prisma.medicalRecord.update({
      where: {
        id: recordId,
        petId: petId, // Ensure it belongs to the specified pet
      },
      data,
    });

    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.error("Error updating medical record:", error);
    return NextResponse.json(
      { error: "Failed to update medical record" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { petId: string; recordId: string } }
) {
  const { petId, recordId } = params;

  try {
    const deletedRecord = await prisma.medicalRecord.delete({
      where: {
        id: recordId,
        petId: petId, // Ensure it belongs to the specified pet
      },
    });

    return NextResponse.json(deletedRecord);
  } catch (error) {
    console.error("Error deleting medical record:", error);
    return NextResponse.json(
      { error: "Failed to delete medical record" },
      { status: 500 }
    );
  }
}
