import prisma from "@/prisma/db";
import { NextResponse } from "next/server";
export async function GET(
  request: Request,
  { params }: { params: { petId: string } }
) {
  const petId = params.petId;

  try {
    const appointments = await prisma.appointment.findMany({
      where: { petId },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { petId: string } }
) {
  const petId = params.petId;
  const body = await request.json();

  try {
    const newAppointment = await prisma.appointment.create({
      data: {
        petId,
        reason: body.reason,
        date: new Date(body.date),
        time: new Date(`${body.date}T${body.time}`), // Combine date and time
        petOwnerId: body.petOwnerId,
      },
    });

    return NextResponse.json(newAppointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}
